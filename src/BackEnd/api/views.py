from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status, generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.generics import RetrieveAPIView
from .models import Produto, Pedido, Fornecedor, Usuario
from .serializers import ProdutoSerializer, PedidoSerializer, FornecedorSerializer, CreateUsuarioSerializer

@api_view(['GET'])
def listar_produtos(request):
    produtos = Produto.objects.all()
    serializer = ProdutoSerializer(produtos, many=True)
    return Response(serializer.data)

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

class DetalharProdutoView(RetrieveAPIView):
    queryset = Produto.objects.all()
    serializer_class = ProdutoSerializer

@api_view(['GET'])
def listar_pedidos(request):
    pedidos = Pedido.objects.all()
    serializer = PedidoSerializer(pedidos, many=True)
    return Response(serializer.data)

@api_view(['POST'])
def criar_pedido(request):
    serializer = PedidoSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(cliente=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def listar_fornecedores(request):
    fornecedores = Fornecedor.objects.all()
    serializer = FornecedorSerializer(fornecedores, many=True)
    return Response(serializer.data)

class UsuarioCreateView(generics.CreateAPIView):
    queryset = Usuario.objects.all()
    serializer_class = CreateUsuarioSerializer
