from rest_framework_simplejwt.views import TokenObtainPairView  
from .serializers import CustomTokenObtainPairSerializer
from rest_framework.decorators import api_view, permission_classes 
from rest_framework.views import APIView 
from rest_framework.response import Response 
from rest_framework import status, generics 
from rest_framework.permissions import IsAuthenticated 
from rest_framework.generics import RetrieveAPIView, RetrieveUpdateDestroyAPIView 
from rest_framework.exceptions import PermissionDenied 
from django.db import transaction, IntegrityError 
from django.db.models import Avg, Sum, F 
from .models import Produto, Pedido, Usuario, Categoria, Carrinho, ItemCarrinho, ListaDesejos, Avaliacao, ItemPedido
from .serializers import (
    ProdutoSerializer,
    PedidoSerializer,
    CreateUsuarioSerializer,
    CategoriaSerializer,
    CarrinhoSerializer,
    ProdutoResumoSerializer,
    AvaliacaoSerializer,
    UsuarioSerializer
)

class CustomTokenObtainPairView(TokenObtainPairView):  # View JWT que usa um serializer customizado
    serializer_class = CustomTokenObtainPairSerializer  # Define o serializer para controlar payload do token

# Endpoint para listar produtos
@api_view(['GET'])
def listar_produtos(request):
    produtos = Produto.objects.all()

    categoria_id = request.GET.get('categoria')  # (?categoria=)
    nome = request.GET.get('nome')  # (?nome=)

    if categoria_id:  
        produtos = produtos.filter(categoria_id=categoria_id)

    if nome:
        produtos = produtos.filter(nome__icontains=nome)

    serializer = ProdutoSerializer(produtos, many=True)
    return Response(serializer.data)  # Retorna JSON com os produtos

# Criar produto
@api_view(['POST'])
def criar_produto(request):
    if not request.user.is_authenticated:
        return Response({'erro': 'Autenticação obrigatória.'}, status=status.HTTP_401_UNAUTHORIZED)
    
    if request.user.tipo_conta != 'vendedor':
        return Response({'erro': 'Apenas usuários do tipo "vendedor" podem criar produtos.'}, status=status.HTTP_403_FORBIDDEN)
    
    serializer = ProdutoSerializer(data=request.data)  # Prepara serializer
    if serializer.is_valid():  # Valida campos
        serializer.save(fornecedor=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Detalhar produto
class DetalharProdutoView(RetrieveAPIView):
    queryset = Produto.objects.all()
    serializer_class = ProdutoSerializer

# Listar produtos do fornecedor (usuário vendedor)
@api_view(['GET'])
@permission_classes([IsAuthenticated])  # Exige autenticação
def listar_produtos_do_fornecedor(request):
    if request.user.tipo_conta != 'vendedor':  # Só vendedores podem ver os próprios produtos
        return Response({'erro':'Apenas vendedores podem acessar seus produtos.'}, status=403)  # 403 se não for vendedor

    produtos = Produto.objects.filter(fornecedor=request.user)  # Filtra por fornecedor = usuário
    serializer = ProdutoSerializer(produtos, many=True)  # Serializa lista
    return Response(serializer.data)  # Retorna JSON

# Criar usuário
class UsuarioCreateView(generics.CreateAPIView):
    queryset = Usuario.objects.all() 
    serializer_class = CreateUsuarioSerializer  # Serializer específico para criação de usuário

# Atualizar/deletar produto
class ProdutoUpdateDeleteView(RetrieveUpdateDestroyAPIView):  # View para GET/PUT/PATCH/DELETE
    queryset = Produto.objects.all()  # Fonte de dados
    serializer_class = ProdutoSerializer  # Serializer de produto
    permission_classes = [IsAuthenticated]

    def perform_update(self, serializer):  # Hook chamado ao atualizar
        produto = self.get_object()  # produto que será deletado
        if self.request.user != produto.fornecedor:  # Verifica se o usuário é o dono do produto
            raise PermissionDenied('Voce não tem a permissão para atualizar o produto.')  # 403
        serializer.save()  # Salva as alterações

    def perform_destroy(self, instance):  # Hook chamado ao deletar
        if self.request.user != instance.fornecedor:  
            raise PermissionDenied('Voce não tem permissão para deletar o produto.')
        instance.delete()  # Remove o produto

# Listar categorias
@api_view(['GET'])
def listar_categorias(request):  # Retorna todas as categorias
    categorias = Categoria.objects.all()
    serializer = CategoriaSerializer(categorias, many=True)
    return Response(serializer.data) 

# Criar ou obter carrinho
def get_or_create_cart(user):
    carrinho, created = Carrinho.objects.get_or_create(usuario=user)  # Cria caso não exista
    return carrinho  # Retorna carrinho

# Ver carrinho
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def ver_carrinho(request):
    carrinho, _ = Carrinho.objects.get_or_create(usuario=request.user)  # Garante existência do carrinho
    serializer = CarrinhoSerializer(carrinho)  # Serializa carrinho com itens
    return Response(serializer.data)  # Retorna JSON

# Adicionar item ao carrinho
@api_view(['POST'])  # Apenas POST
@permission_classes([IsAuthenticated])  # Exige autenticação
def adicionar_ao_carrinho(request):  # Adiciona um produto ao carrinho do usuário
    carrinho = get_or_create_cart(request.user)  # Obtém/cria carrinho do usuário
    produto_id = request.data.get('produto_id')  # ID do produto a adicionar
    quantidade = request.data.get('quantidade', 1)  # Quantidade informada (default 1)

    try:
        produto = Produto.objects.get(id=produto_id)  # Busca produto pelo ID
    except Produto.DoesNotExist:
        return Response({'erro': 'Produto não encontrado.'}, status=status.HTTP_404_NOT_FOUND)  # 404 se não existe

    item, created = ItemCarrinho.objects.get_or_create(carrinho=carrinho, produto=produto, defaults={  # Cria item se não existir
        'quantidade': quantidade,
        'preco_unitario': produto.preco,
    })

    if not created:  # Se já existia, apenas incrementa a quantidade
        item.quantidade += int(quantidade)
        item.save()

    return Response({'mensagem': 'Produto adicionado ao carrinho com sucesso.'})  # Retorna mensagem de sucesso

# Atualizar item do carrinho
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def atualizar_item_carrinho(request, item_id):
    try:
        item = ItemCarrinho.objects.get(id=item_id, carrinho__usuario=request.user)  # Garante pertencer ao usuário
    except ItemCarrinho.DoesNotExist:
        return Response({'erro': 'Item não encontrado.'}, status=status.HTTP_404_NOT_FOUND)  # 404

    item.quantidade = request.data.get('quantidade', item.quantidade)  # Atualiza quantidade
    item.save()
    return Response({'mensagem': 'Item atualizado com sucesso.'})

# Remover item do carrinho
@api_view(['DELETE'])  # Remoção via DELETE
@permission_classes([IsAuthenticated])  # Exige autenticação
def remover_item_carrinho(request, item_id):  # Remove um item do carrinho do usuário
    try:
        item = ItemCarrinho.objects.get(id=item_id, carrinho__usuario=request.user)
        item.delete()  # Deleta item
        return Response({'mensagem': 'Item removido do carrinho.'})  # Confirma remoção
    except ItemCarrinho.DoesNotExist:
        return Response({'erro': 'Item não encontrado.'}, status=status.HTTP_404_NOT_FOUND)  # 404

# Finalizar carrinho
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def finalizar_carrinho(request):  # Converte itens do carrinho em um Pedido
    user = request.user
    carrinho = get_or_create_cart(user)  # Obtém carrinho
    itens = carrinho.itens.all()  # Recupera itens relacionados ao carrinho

    if not itens.exists():
        return Response({'erro': 'Carrinho vazio.'}, status=400)  # 400

    with transaction.atomic():  # tudo ou nada
        for item in itens:  # Valida estoque de cada item antes de criar pedido
            if item.quantidade > item.produto.quantidade_estoque:  # Sem estoque suficiente?
                return Response(
                    {'erro': f'Estoque insuficiente para o produto {item.produto.nome}.'},
                    status=400
                )

        pedido = Pedido.objects.create(cliente=user)  # Cria o pedido para o cliente

        for item in itens:  # Cria os itens do pedido e diminui o estoque
            pedido.itens.create(  # (related_name='itens') para ItemPedido
                produto=item.produto,
                quantidade=item.quantidade,
                preco_unitario=item.produto.preco
            )
            item.produto.quantidade_estoque -= item.quantidade
            item.produto.save()

        itens.delete()  # Limpa o carrinho após gerar o pedido

    serializer = PedidoSerializer(pedido)  # Serializa o pedido criado
    return Response({'mensagem': 'Pedido realizado com sucesso.', 'pedido': serializer.data}, status=201)

# Lista de desejos
class ListaDesejosView(APIView): # wl
    permission_classes = [IsAuthenticated]

    def get(self, request):  # Retorna produtos da lista de desejos do usuário
        desejos = ListaDesejos.objects.filter(usuario=request.user)  # Busca entradas da wl do usuário
        produtos = [item.produto for item in desejos]  # Extrai os produtos das entradas
        serializer = ProdutoResumoSerializer(produtos, many=True)  # Serializar resumo dos produtos
        return Response(serializer.data)  # Retorna JSON

    def post(self, request):  # Adiciona um produto à lista de desejos
        produto_id = request.data.get('produto_id')  # ID do produto a adicionar
        if not produto_id:  # Valida presença do campo
            return Response({'erro': 'produto_id é obrigatório.'}, status=status.HTTP_400_BAD_REQUEST)  # 400

        try:
            produto = Produto.objects.get(id=produto_id)  # Busca produto
        except Produto.DoesNotExist:
            return Response({'erro': 'Produto não encontrado.'}, status=status.HTTP_404_NOT_FOUND)  # 404 

        if ListaDesejos.objects.filter(usuario=request.user, produto=produto).exists():
            return Response({'mensagem': 'Produto já está na lista de desejos.'}, status=status.HTTP_200_OK)  # 200

        ListaDesejos.objects.create(usuario=request.user, produto=produto)  # Cria novo registro na wl
        return Response({'mensagem': 'Produto adicionado à lista de desejos.'}, status=status.HTTP_201_CREATED)  # 201 criado

    def delete(self, request, produto_id):  # Remove um produto da wl
        try:
            item = ListaDesejos.objects.get(usuario=request.user, produto_id=produto_id)  # Busca vínculo
            item.delete()  # Remove
            return Response({'mensagem': 'Produto removido da lista de desejos.'}, status=status.HTTP_204_NO_CONTENT)  # 204
        except ListaDesejos.DoesNotExist:
            return Response({'erro': 'Produto não está na lista de desejos.'}, status=status.HTTP_404_NOT_FOUND)  # 404

# Avaliar produto
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def avaliar_produto(request):
    produto_id = request.data.get('produto_id') 
    nota = request.data.get('nota')
    comentario = request.data.get('comentario', '')

    if not produto_id or nota is None:  # Valida campos obrigatórios
        return Response({'erro': 'Campos produto_id e nota são obrigatórios.'}, status=status.HTTP_400_BAD_REQUEST)  # 400

    try:
        produto = Produto.objects.get(id=produto_id)  # Busca produto
    except Produto.DoesNotExist:
        return Response({'erro': 'Produto não encontrado.'}, status=status.HTTP_404_NOT_FOUND)  # 404 se não existir

    try:
        Avaliacao.objects.create(  # Cria avaliação (assume unique_together para impedir duplicada)
            produto=produto,
            usuario=request.user,
            nota=nota,
            comentario=comentario
        )
    except IntegrityError:  # Se já avaliou (violação de unicidade), cai aqui
        return Response({'erro': 'Você já avaliou este produto.'}, status=status.HTTP_400_BAD_REQUEST)  # 400

    return Response({'mensagem': 'Avaliação registrada com sucesso.'}, status=status.HTTP_201_CREATED)  # 201 criado

# Insights de vendas e avaliações
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def insights_produto(request, pk):  # Retorna métricas do produto para o fornecedor
    try:
        produto = Produto.objects.get(pk=pk)  # Busca produto pelo PK
    except Produto.DoesNotExist:
        return Response({'erro': 'Produto não encontrado.'}, status=status.HTTP_404_NOT_FOUND)  # 404 se não existir

    if produto.fornecedor != request.user:  # Garante que apenas o dono veja os insights
        return Response({'erro': 'Você não tem permissão para acessar os insights deste produto.'}, status=status.HTTP_403_FORBIDDEN)  # 403

    media_nota = Avaliacao.objects.filter(produto=produto).aggregate(avg=Avg('nota'))['avg']  # Média das notas
    total_avaliacoes = Avaliacao.objects.filter(produto=produto).count()  # Contagem de avaliações

    vendas = ItemPedido.objects.filter(produto=produto).aggregate(  # Agrega quantitativo vendido e receita
        quantidade_vendida=Sum('quantidade'),
        receita_total=Sum(F('quantidade') * F('preco_unitario')) # O F é para referenciar os campos do modelo
    )

    quantidade_vendida = vendas['quantidade_vendida'] or 0  # Normaliza None para 0
    receita_total = vendas['receita_total'] or 0 

    return Response({  # Retorna dicionário com métricas
        'produto': produto.nome,
        'media_nota': round(media_nota or 0, 2),  # Arredondar média com 2 casas (0 se sem avaliações)
        'total_avaliacoes': total_avaliacoes,
        'receita_total': float(receita_total),  # Converte Decimal para float para JSON
        'total_produtos_vendidos': quantidade_vendida
    })

# Histórico de compras
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def historico_compras(request):  # Lista pedidos do cliente logado
    pedidos = Pedido.objects.filter(cliente=request.user).order_by('-data')  # Ordena por data desc
    serializer = PedidoSerializer(pedidos, many=True)
    return Response(serializer.data)

# Histórico de vendas
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def historico_vendas(request):  # Lista pedidos que contêm itens de produtos do fornecedor logado
    itens = ItemPedido.objects.filter(produto__fornecedor=request.user).select_related('pedido')  # Busca itens vendidos
    pedidos_ids = itens.values_list('pedido_id', flat=True).distinct()  # Extrai IDs únicos de pedidos
    pedidos = Pedido.objects.filter(id__in=pedidos_ids).order_by('-data')  # Busca pedidos correspondentes
    serializer = PedidoSerializer(pedidos, many=True)  # Serializa pedidos
    return Response(serializer.data)

# Alterar perfil (PATCH)
class AlterarPerfilView(generics.RetrieveUpdateAPIView):  # Permite ver/alterar dados do próprio usuário
    serializer_class = UsuarioSerializer  # Serializer de leitura/atualização do usuário
    permission_classes = [IsAuthenticated]

    def get_object(self):  # Define o objeto alvo como o próprio usuário
        return self.request.user  # Retorna o usuário autenticado
