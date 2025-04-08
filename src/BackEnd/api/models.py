from django.db import models
from django.contrib.auth.models import AbstractUser

class Usuario(AbstractUser):
    VENDEDOR = 'vendedor'
    COMPRADOR = 'comprador'
    
    TIPO_CONTA_CHOICES = [
        (VENDEDOR, 'Vendedor'),
        (COMPRADOR, 'Comprador'),
    ]

    nome_completo = models.CharField(max_length=255)
    telefone = models.CharField(max_length=15)
    endereco = models.TextField(blank=True, null=True, default='Sem endereço informado')
    tipo_conta = models.CharField(
        max_length=20,
        choices=TIPO_CONTA_CHOICES,
        default=COMPRADOR,
    )

    def __str__(self):
        return f'{self.username} ({self.tipo_conta}) - {self.nome_completo}'

class Categoria(models.Model):
    nome = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.nome

class Fornecedor(models.Model):
    nome = models.CharField(max_length=250)
    email = models.EmailField(unique=True)
    telefone = models.CharField(max_length=11, blank=True, null=True)
    endereco = models.TextField(blank=True, null=True, default='Sem endereço informado')

    def __str__(self):
        return self.nome

class Produto(models.Model):
    nome = models.CharField(max_length=250)
    descricao = models.TextField(blank=True, null=True)
    preco = models.DecimalField(max_digits=10, decimal_places=2)
    quantidade_estoque = models.PositiveIntegerField()
    categoria = models.ForeignKey(Categoria, on_delete=models.CASCADE, related_name='produtos')
    fornecedor = models.ForeignKey(Usuario, on_delete=models.CASCADE, related_name='produtos')

    def __str__(self):
        return self.nome

class Pedido(models.Model):
    cliente = models.ForeignKey(Usuario, on_delete=models.CASCADE, related_name='pedidos')
    data = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'Pedido #{self.id} - {self.cliente.nome_completo}'

class ItemPedido(models.Model):
    pedido = models.ForeignKey(Pedido, on_delete=models.CASCADE, related_name='itens')
    produto = models.ForeignKey(Produto, on_delete=models.CASCADE)
    quantidade = models.PositiveIntegerField()
    preco_unitario = models.DecimalField(max_digits=10, decimal_places=2)

    def subtotal(self):
        return self.quantidade * self.preco_unitario

    def __str__(self):
        return f'{self.quantidade} x {self.produto.nome} - Pedido {self.pedido.id}'
