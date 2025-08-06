from django.urls import path
from .views import (
    listar_produtos, criar_produto, DetalharProdutoView,
    listar_pedidos, criar_pedido, listar_fornecedores, UsuarioCreateView,
    ProdutoUpdateDeleteView, listar_categorias, listar_produtos_do_fornecedor,
    ver_carrinho, adicionar_ao_carrinho, remover_item_carrinho, atualizar_item_carrinho, finalizar_carrinho
)

urlpatterns = [
    # Rotas relacionadas a produtos
    path('produtos/', listar_produtos, name='listar_produtos'),  # Lista todos os produtos, com filtros opcionais
    path('produtos/criar/', criar_produto, name='criar_produto'),  # Criação de um novo produto
    path('produtos/<int:pk>/', ProdutoUpdateDeleteView.as_view(), name='editar_ou_deletar_produto'),  # Visualização, edição ou exclusão de um produto específico
    path('produtos/<int:pk>/editar/', ProdutoUpdateDeleteView.as_view()),

    # Rotas relacionadas a pedidos
    path('pedidos/', listar_pedidos, name='listar_pedidos'),  # Lista todos os pedidos
    path('pedidos/criar/', criar_pedido, name='criar_pedido'),  # Criação de um novo pedido

    # Rota para listagem de fornecedores
    path('fornecedores/', listar_fornecedores, name='listar_fornecedores'),

    # Rota para listagem produtos do fornecedores
    path('fornecedor/produtos/', listar_produtos_do_fornecedor, name='meus_produtos'),

    # Rota para criação de novo usuário
    path('usuarios/novo/', UsuarioCreateView.as_view(), name='usuario-create'),

    # Rota para listagem de categorias
    path('categorias/', listar_categorias, name='listar_categorias'),

    path('carrinho/', ver_carrinho, name='ver_carrinho'),
    path('carrinho/adicionar/', adicionar_ao_carrinho, name='adicionar_ao_carrinho'),
    path('carrinho/atualizar/<int:item_id>/', atualizar_item_carrinho, name='atualizar_item_carrinho'),
    path('carrinho/remover/<int:item_id>/', remover_item_carrinho, name='remover_item_carrinho'),
    path('carrinho/finalizar/', finalizar_carrinho, name='finalizar-carrinho'),

]
