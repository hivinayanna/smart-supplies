from django.urls import path
from .views import (
    listar_produtos, criar_produto, detalhar_produto,
    listar_pedidos, criar_pedido, listar_fornecedores
)

urlpatterns = [
    path('produtos/', listar_produtos, name='listar_produtos'),
    path('produtos/', criar_pedido, name='criar_produto'),
    path('produtos/', detalhar_produto, name='detalhar_produto'),
    path('pedidos/', listar_pedidos,name='listar_pedidos'),
    path('pedidos/criar/', criar_pedido,name='criar_pedido'),
    path('fornecedores/', listar_fornecedores,name='listar_fornecedores'),
]
