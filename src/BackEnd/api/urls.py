from django.urls import path
from .views import (
    listar_produtos, criar_produto,
    UsuarioCreateView,
    ProdutoUpdateDeleteView, listar_categorias, listar_produtos_do_fornecedor,
    ver_carrinho, adicionar_ao_carrinho, remover_item_carrinho, atualizar_item_carrinho, finalizar_carrinho, ListaDesejosView, avaliar_produto,
    insights_produto, historico_compras, historico_vendas, AlterarPerfilView
)

urlpatterns = [
    # Produtos
    path('produtos/', listar_produtos, name='listar_produtos'),
    path('produtos/criar/', criar_produto, name='criar_produto'),
    path('produtos/<int:pk>/', ProdutoUpdateDeleteView.as_view(), name='editar_ou_deletar_produto'),
    path('produtos/<int:pk>/editar/', ProdutoUpdateDeleteView.as_view()),

    # Produtos do fornecedor (usuário vendedor)
    path('fornecedor/produtos/', listar_produtos_do_fornecedor, name='meus_produtos'),

    # Usuários
    path('usuarios/novo/', UsuarioCreateView.as_view(), name='usuario-create'),

    # Categorias
    path('categorias/', listar_categorias, name='listar_categorias'),

    # Carrinho
    path('carrinho/', ver_carrinho, name='ver_carrinho'),
    path('carrinho/adicionar/', adicionar_ao_carrinho, name='adicionar_ao_carrinho'),
    path('carrinho/atualizar/<int:item_id>/', atualizar_item_carrinho, name='atualizar_item_carrinho'),
    path('carrinho/remover/<int:item_id>/', remover_item_carrinho, name='remover_item_carrinho'),
    path('carrinho/finalizar/', finalizar_carrinho, name='finalizar-carrinho'),

    # Lista de desejos 
    path('lista-desejos/', ListaDesejosView.as_view(), name='lista-desejos'),
    path('lista-desejos/<int:produto_id>/', ListaDesejosView.as_view(), name='remover-lista-desejos'),

    # Avaliação
    path('produtos/avaliar/', avaliar_produto),

    # Insights
    path('produtos/<int:pk>/insights/', insights_produto, name='insights-produto'),

    # Histórico
    path('historico/compras/', historico_compras, name='historico-compras'),
    path('historico/vendas/', historico_vendas, name='historico-vendas'),

    # Perfil
    path('usuarios/meu-perfil/', AlterarPerfilView.as_view(), name='alterar-perfil'),
]
