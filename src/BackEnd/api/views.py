from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status, generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.generics import RetrieveAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.exceptions import PermissionDenied 
from .models import Produto, Pedido, Fornecedor, Usuario, Categoria, Carrinho, ItemCarrinho
from .serializers import ProdutoSerializer, PedidoSerializer, FornecedorSerializer, CreateUsuarioSerializer, CategoriaSerializer, CarrinhoSerializer, ItemCarrinhoSerializer

# Endpoint para listar produtos, com filtros opcionais por categoria e nome
@api_view(['GET'])
def listar_produtos(request):
    produtos = Produto.objects.all()

    categoria_id = request.GET.get('categoria')
    nome = request.GET.get('nome')

    if categoria_id:
        produtos = produtos.filter(categoria_id=categoria_id)

    if nome:
        produtos = produtos.filter(nome__icontains=nome)

    serializer = ProdutoSerializer(produtos, many=True)
    return Response(serializer.data)

# Endpoint para criação de um novo produto
@api_view(['POST'])
def criar_produto(request):
    # Verifica se o usuário está autenticado
    if not request.user.is_authenticated:
        return Response({'erro': 'Autenticação obrigatória.'}, status=status.HTTP_401_UNAUTHORIZED)
    
    # Verifica se o usuário tem tipo de conta 'vendedor'
    if request.user.tipo_conta != 'vendedor':
        return Response({'erro': 'Apenas usuários do tipo "vendedor" podem criar produtos.'}, status=status.HTTP_403_FORBIDDEN)
    
    serializer = ProdutoSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(fornecedor=request.user)  # Associa o produto ao usuário autenticado
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# View para detalhar um produto específico usando RetrieveAPIView
class DetalharProdutoView(RetrieveAPIView):
    queryset = Produto.objects.all()
    serializer_class = ProdutoSerializer

# Endpoint para listar todos os pedidos
@api_view(['GET'])
def listar_pedidos(request):
    pedidos = Pedido.objects.all()
    serializer = PedidoSerializer(pedidos, many=True)
    return Response(serializer.data)

# Endpoint para criação de um novo pedido
@api_view(['POST'])
def criar_pedido(request):
    # Verifica se o usuário está autenticado
    if not request.user.is_authenticated:
        return Response({'erro': 'Autenticação obrigatória.'}, status=status.HTTP_401_UNAUTHORIZED)

    # Validação incorreta: verifica se é vendedor para criar pedido (provavelmente deveria ser 'cliente')
    if request.user.tipo_conta != 'vendedor':
        return Response({'erro': 'Apenas usuários do tipo "vendedor" podem criar produtos.'}, status=status.HTTP_403_FORBIDDEN)

    serializer = PedidoSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(cliente=request.user)  # Associa o pedido ao usuário autenticado
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Endpoint para listar fornecedores
@api_view(['GET'])
def listar_fornecedores(request):
    fornecedores = Fornecedor.objects.all()
    serializer = FornecedorSerializer(fornecedores, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def listar_produtos_do_fornecedor(request):
    if request.user.tipo_conta != 'vendedor':
        return Response({'erro':'Apenas vendedores podem acessar seus produtos.'}, status=403)

    produtos = Produto.objects.filter(fornecedor=request.user)
    serializer = ProdutoSerializer(produtos, many=True)
    return Response(serializer.data)
# View para criação de novos usuários
class UsuarioCreateView(generics.CreateAPIView):
    queryset = Usuario.objects.all()
    serializer_class = CreateUsuarioSerializer

# View para atualizar e deletar um produto, com verificação de permissão
class ProdutoUpdateDeleteView(RetrieveUpdateDestroyAPIView):
    queryset = Produto.objects.all()
    serializer_class = ProdutoSerializer
    permission_classes = [IsAuthenticated]

    # Garante que apenas o fornecedor do produto pode atualizá-lo
    def perform_update(self, serializer):
        produto = self.get_object()
        if self.request.user != produto.fornecedor:
            raise PermissionDenied('Voce não tem a permissão para atualizar o produto.')
        serializer.save()

    # Garante que apenas o fornecedor do produto pode deletá-lo
    def perform_destroy(self, instance):
        if self.request.user != instance.fornecedor:
            raise PermissionDenied('Voce não tem permissão para deletar o produto.')
        instance.delete()


# Endpoint para listar categorias disponíveis
@api_view(['GET'])
def listar_categorias(request):
    categorias = Categoria.objects.all()
    serializer = CategoriaSerializer(categorias, many=True)
    return Response(serializer.data)

# Aqui eu obter ou criar o carrinho do usuario(caso ele não tenha)
def get_or_create_cart(user):
    carrinho, created = Carrinho.objects.get_or_create(usuario=user)
    return carrinho

# Ver o carrinho
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def ver_carrinho(request):
    carrinho, _ = Carrinho.objects.get_or_create(usuario=request.user)
    serializer = CarrinhoSerializer(carrinho)
    return Response(serializer.data)

#Adicionar item ao carrinho
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def adicionar_ao_carrinho(request):
    carrinho = get_or_create_cart(request.user)
    produto_id = request.data.get('produto_id')
    quantidade = request.data.get('quantidade', 1)

    try:
        produto = Produto.objects.get(id=produto_id)
    except Produto.DoesNotExist:
        return Response({'erro': 'Produto não encontrado.'}, status=status.HTTP_404_NOT_FOUND)

    item, created = ItemCarrinho.objects.get_or_create(carrinho=carrinho, produto=produto, defaults={
        'quantidade': quantidade,
        'preco_unitario': produto.preco,
    })

    if not created:
        item.quantidade += int(quantidade)
        item.save()

    return Response({'mensagem': 'Produto adicionado ao carrinho com sucesso.'})

# Atualizar quantidade de um item do carrinho
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def atualizar_item_carrinho(request, item_id):
    try:
        item = ItemCarrinho.objects.get(id=item_id, carrinho__usuario=request.user)
    except ItemCarrinho.DoesNotExist:
        return Response({'erro': 'Item não encontrado.'}, status=status.HTTP_404_NOT_FOUND)

    item.quantidade = request.data.get('quantidade', item.quantidade)
    item.save()
    return Response({'mensagem': 'Item atualizado com sucesso.'})


# Remover item do carrinho
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def remover_item_carrinho(request, item_id):
    try:
        item = ItemCarrinho.objects.get(id=item_id, carrinho__usuario=request.user)
        item.delete()
        return Response({'mensagem': 'Item removido do carrinho.'})
    except ItemCarrinho.DoesNotExist:
        return Response({'erro': 'Item não encontrado.'}, status=status.HTTP_404_NOT_FOUND)