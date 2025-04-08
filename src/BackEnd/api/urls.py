from django.urls import path
from .views import (
    listar_produtos, criar_produto, DetalharProdutoView,
    listar_pedidos, criar_pedido, listar_fornecedores, UsuarioCreateView
)

urlpatterns = [
    # Produtos
    path('produtos/', listar_produtos, name='listar_produtos'),
    path('produtos/criar/', criar_produto, name='criar_produto'),
    path('produtos/<int:pk>/', DetalharProdutoView.as_view(), name='detalhar_produto'),

    # Pedidos
    path('pedidos/', listar_pedidos, name='listar_pedidos'),
    path('pedidos/criar/', criar_pedido, name='criar_pedido'),

    # Fornecedores
    path('fornecedores/', listar_fornecedores, name='listar_fornecedores'),

    # Usuario
    path('usuarios/novo/', UsuarioCreateView.as_view(), name='usuario-create'),

]
