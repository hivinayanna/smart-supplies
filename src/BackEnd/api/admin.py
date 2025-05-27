from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import Usuario, Produto, Categoria, Pedido, ItemPedido, Fornecedor

# Registro customizado do modelo Usuario no admin do Django
@admin.register(Usuario)
class UserAdmin(admin.ModelAdmin):
    model = Usuario

    # Campos que aparecem na lista principal de usuários no admin
    list_display = ('username', 'nome_completo', 'telefone', 'endereco', 'tipo_conta', 'is_staff')
    # Filtros laterais para facilitar a busca por tipo de conta, status e permissões
    list_filter = ('tipo_conta', 'is_staff', 'is_active', 'is_superuser')
    # Campos pesquisáveis na busca rápida do admin
    search_fields = ('username', 'nome_completo', 'telefone', 'email')

    # Campos exibidos e editáveis no formulário de alteração de usuário, adicionando campos extras
    fieldsets = UserAdmin.fieldsets + (
        ('Informações adicionais', {
            'fields': (
                'nome_completo',
                'telefone',
                'endereco',
                'tipo_conta',
            ),
        }),
    )

    # Campos exibidos no formulário de criação de usuário, incluindo os campos extras
    add_fieldsets = UserAdmin.add_fieldsets + (
        ('Informações adicionais', {
            'fields': (
                'nome_completo',
                'telefone',
                'endereco',
                'tipo_conta',
            )
        }),
    )

# Registro simples dos demais modelos no admin padrão do Django
admin.site.register(Categoria)
admin.site.register(Produto)
admin.site.register(Pedido)
admin.site.register(ItemPedido)
admin.site.register(Fornecedor)
