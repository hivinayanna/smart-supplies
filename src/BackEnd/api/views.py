from django.shortcuts import render
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.permissions import IsAuthenticated
from .models import Produto
from .serializers import ProdutoSerializer

@api_view(['GET'])
def listar_produtos(request): #vai retornar a lista com os produtos disponíveis
    produtos = Produto.objects.all()
    serializer = ProdutoSerializer(produtos, many=True)
    return Response(serializer.data)

@api_view(['POST'])
def criar_produto(request): # vai permitir que o vendedor crie o produto
    if not request.user.is_authenticated:
        return Response({'error':'A autenticação é necessária'}, status=status.HTTP_401_UNAUTHORIZED)
    
    serializer = ProdutoSerializer(data=request.data)
    if serializer.isvalid():
        serializer.save(fornecedor=request.user)
        return Response(serializer.data,status=status.HTTP_201_CREATED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)