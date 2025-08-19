from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import Usuario, Produto, Categoria, Pedido, ItemPedido, Carrinho, ListaDesejos, ItemCarrinho, Avaliacao

# Registro customizado do modelo Usuario no admin do Django
@admin.register(Usuario)
class CustomUserAdmin(BaseUserAdmin):
    model = Usuario # Define que este admin gerencia o modelo Usuario

    list_display = ('username', 'nome_completo', 'telefone', 'endereco', 'tipo_conta', 'is_staff') # Campos exibidos na lista de usuários do admin
    list_filter = ('tipo_conta', 'is_staff', 'is_active', 'is_superuser') # Filtros exibidos na lateral direita para facilitar a busca
    search_fields = ('username', 'nome_completo', 'telefone', 'email')  # Campos que podem ser pesquisados na barra de busca do admin

    # Campos exibidos na página de edição de um usuário
    # Herda os fieldsets do UserAdmin e adiciona mais um grupo
    fieldsets = BaseUserAdmin.fieldsets + (
        ('Informações adicionais', {
            'fields': (
                'nome_completo',
                'telefone',
                'endereco',
                'tipo_conta',
            ),
        }),
    )

    add_fieldsets = BaseUserAdmin.add_fieldsets + (
        ('Informações adicionais', {
            'fields': (
                'nome_completo',
                'telefone',
                'endereco',
                'tipo_conta',
            )
        }),
    )

# Registro dos demais modelos
admin.site.register(Categoria)
admin.site.register(Produto)
admin.site.register(Pedido)
admin.site.register(ItemPedido)
admin.site.register(Carrinho)
admin.site.register(ItemCarrinho)
admin.site.register(ListaDesejos)
admin.site.register(Avaliacao)
