from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import Usuario, Produto, Categoria, Pedido, ItemPedido, Carrinho, ListaDesejos, ItemCarrinho, Avaliacao

# Registro customizado do modelo Usuario no admin do Django
@admin.register(Usuario)
class CustomUserAdmin(BaseUserAdmin):
    model = Usuario

    list_display = ('username', 'nome_completo', 'telefone', 'endereco', 'tipo_conta', 'is_staff')
    list_filter = ('tipo_conta', 'is_staff', 'is_active', 'is_superuser')
    search_fields = ('username', 'nome_completo', 'telefone', 'email')

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
