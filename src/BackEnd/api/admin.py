from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import Usuario

@admin.register(Usuario)
class UserAdmin(admin.ModelAdmin):
    model = Usuario

    #(admin/usuarios/)
    list_display = ('username', 'nome_completo', 'telefone', 'endereco', 'tipo_conta', 'is_staff')
    list_filter = ('tipo_conta', 'is_staff', 'is_active', 'is_superuser')
    search_fields = ('username', 'nome_completo', 'telefone', 'email')

    # gerenciar os usuários
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
    
