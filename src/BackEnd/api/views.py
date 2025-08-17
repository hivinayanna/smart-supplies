from rest_framework.decorators import api_view, permission_classes
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.generics import RetrieveAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.exceptions import PermissionDenied 
from django.db import transaction, IntegrityError
from django.db.models import Avg, Sum, F
from .models import Produto, Pedido, ItemPedido, Usuario, Categoria, Carrinho, ItemCarrinho, ListaDesejos, Avaliacao, ItemPedido
from .serializers import (
    ProdutoSerializer,
    PedidoSerializer,
    CreateUsuarioSerializer,
    CategoriaSerializer,
    CarrinhoSerializer,
    ProdutoResumoSerializer,
    AvaliacaoSerializer,
    UsuarioUpdateSerializer
)

# Endpoint para listar produtos
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

# Criar produto
@api_view(['POST'])
def criar_produto(request):
    if not request.user.is_authenticated:
        return Response({'erro': 'Autenticação obrigatória.'}, status=status.HTTP_401_UNAUTHORIZED)
    
    if request.user.tipo_conta != 'vendedor':
        return Response({'erro': 'Apenas usuários do tipo "vendedor" podem criar produtos.'}, status=status.HTTP_403_FORBIDDEN)
    
    serializer = ProdutoSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(fornecedor=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Detalhar produto
class DetalharProdutoView(RetrieveAPIView):
    queryset = Produto.objects.all()
    serializer_class = ProdutoSerializer

# Listar produtos do fornecedor (usuário vendedor)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def listar_produtos_do_fornecedor(request):
    if request.user.tipo_conta != 'vendedor':
        return Response({'erro':'Apenas vendedores podem acessar seus produtos.'}, status=403)

    produtos = Produto.objects.filter(fornecedor=request.user)
    serializer = ProdutoSerializer(produtos, many=True)
    return Response(serializer.data)

# Criar usuário
class UsuarioCreateView(generics.CreateAPIView):
    queryset = Usuario.objects.all()
    serializer_class = CreateUsuarioSerializer

# Atualizar/deletar produto
class ProdutoUpdateDeleteView(RetrieveUpdateDestroyAPIView):
    queryset = Produto.objects.all()
    serializer_class = ProdutoSerializer
    permission_classes = [IsAuthenticated]

    def perform_update(self, serializer):
        produto = self.get_object()
        if self.request.user != produto.fornecedor:
            raise PermissionDenied('Voce não tem a permissão para atualizar o produto.')
        serializer.save()

    def perform_destroy(self, instance):
        if self.request.user != instance.fornecedor:
            raise PermissionDenied('Voce não tem permissão para deletar o produto.')
        instance.delete()

# Listar categorias
@api_view(['GET'])
def listar_categorias(request):
    categorias = Categoria.objects.all()
    serializer = CategoriaSerializer(categorias, many=True)
    return Response(serializer.data)

# Criar ou obter carrinho
def get_or_create_cart(user):
    carrinho, created = Carrinho.objects.get_or_create(usuario=user)
    return carrinho

# Ver carrinho
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def ver_carrinho(request):
    carrinho, _ = Carrinho.objects.get_or_create(usuario=request.user)
    serializer = CarrinhoSerializer(carrinho)
    return Response(serializer.data)

# Adicionar item ao carrinho
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

# Atualizar item do carrinho
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

# Finalizar carrinho
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def finalizar_carrinho(request):
    user = request.user
    carrinho = get_or_create_cart(user)
    itens = carrinho.itens.all()

    if not itens.exists():
        return Response({'erro': 'Carrinho vazio.'}, status=400)

    with transaction.atomic():
        for item in itens:
            if item.quantidade > item.produto.quantidade_estoque:
                return Response(
                    {'erro': f'Estoque insuficiente para o produto {item.produto.nome}.'},
                    status=400
                )

        pedido = Pedido.objects.create(cliente=user)

        for item in itens:
            pedido.itens.create(
                produto=item.produto,
                quantidade=item.quantidade,
                preco_unitario=item.produto.preco
            )
            item.produto.quantidade_estoque -= item.quantidade
            item.produto.save()

        itens.delete()

    serializer = PedidoSerializer(pedido)
    return Response({'mensagem': 'Pedido realizado com sucesso.', 'pedido': serializer.data}, status=201)

# Lista de desejos
class ListaDesejosView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        desejos = ListaDesejos.objects.filter(usuario=request.user)
        produtos = [item.produto for item in desejos]
        serializer = ProdutoResumoSerializer(produtos, many=True)
        return Response(serializer.data)

    def post(self, request):
        produto_id = request.data.get('produto_id')
        if not produto_id:
            return Response({'erro': 'produto_id é obrigatório.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            produto = Produto.objects.get(id=produto_id)
        except Produto.DoesNotExist:
            return Response({'erro': 'Produto não encontrado.'}, status=status.HTTP_404_NOT_FOUND)

        if ListaDesejos.objects.filter(usuario=request.user, produto=produto).exists():
            return Response({'mensagem': 'Produto já está na lista de desejos.'}, status=status.HTTP_200_OK)

        ListaDesejos.objects.create(usuario=request.user, produto=produto)
        return Response({'mensagem': 'Produto adicionado à lista de desejos.'}, status=status.HTTP_201_CREATED)

    def delete(self, request, produto_id):
        try:
            item = ListaDesejos.objects.get(usuario=request.user, produto_id=produto_id)
            item.delete()
            return Response({'mensagem': 'Produto removido da lista de desejos.'}, status=status.HTTP_204_NO_CONTENT)
        except ListaDesejos.DoesNotExist:
            return Response({'erro': 'Produto não está na lista de desejos.'}, status=status.HTTP_404_NOT_FOUND)

# Avaliar produto
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def avaliar_produto(request):
    produto_id = request.data.get('produto_id')
    nota = request.data.get('nota')
    comentario = request.data.get('comentario', '')

    if not produto_id or nota is None:
        return Response({'erro': 'Campos produto_id e nota são obrigatórios.'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        produto = Produto.objects.get(id=produto_id)
    except Produto.DoesNotExist:
        return Response({'erro': 'Produto não encontrado.'}, status=status.HTTP_404_NOT_FOUND)

    try:
        Avaliacao.objects.create(
            produto=produto,
            usuario=request.user,
            nota=nota,
            comentario=comentario
        )
    except IntegrityError:
        return Response({'erro': 'Você já avaliou este produto.'}, status=status.HTTP_400_BAD_REQUEST)

    return Response({'mensagem': 'Avaliação registrada com sucesso.'}, status=status.HTTP_201_CREATED)

# Insights de vendas e avaliações
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def insights_produto(request, pk):
    try:
        produto = Produto.objects.get(pk=pk)
    except Produto.DoesNotExist:
        return Response({'erro': 'Produto não encontrado.'}, status=status.HTTP_404_NOT_FOUND)

    if produto.fornecedor != request.user:
        return Response({'erro': 'Você não tem permissão para acessar os insights deste produto.'}, status=status.HTTP_403_FORBIDDEN)

    media_nota = Avaliacao.objects.filter(produto=produto).aggregate(avg=Avg('nota'))['avg']
    total_avaliacoes = Avaliacao.objects.filter(produto=produto).count()

    vendas = ItemPedido.objects.filter(produto=produto).aggregate(
        quantidade_vendida=Sum('quantidade'),
        receita_total=Sum(F('quantidade') * F('preco_unitario'))
    )

    quantidade_vendida = vendas['quantidade_vendida'] or 0
    receita_total = vendas['receita_total'] or 0

    return Response({
        'produto': produto.nome,
        'media_nota': round(media_nota or 0, 2),
        'total_avaliacoes': total_avaliacoes,
        'receita_total': float(receita_total),
        'total_produtos_vendidos': quantidade_vendida
    })

# Histórico de compras
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def historico_compras(request):
    pedidos = Pedido.objects.filter(cliente=request.user).order_by('-data')
    serializer = PedidoSerializer(pedidos, many=True)
    return Response(serializer.data)

# Histórico de vendas
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def historico_vendas(request):
    itens = ItemPedido.objects.filter(produto__fornecedor=request.user).select_related('pedido')
    pedidos_ids = itens.values_list('pedido_id', flat=True).distinct()
    pedidos = Pedido.objects.filter(id__in=pedidos_ids).order_by('-data')
    serializer = PedidoSerializer(pedidos, many=True)
    return Response(serializer.data)

# Alterar perfil
class AlterarPerfilView(generics.RetrieveUpdateAPIView):
    serializer_class = UsuarioUpdateSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user
