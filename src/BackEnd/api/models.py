from django.db import models
from django.contrib.auth.models import AbstractUser

# Modelo que estende o usuário padrão do Django para incluir campos adicionais
class Usuario(AbstractUser):
    # Constantes para os tipos de conta disponíveis
    VENDEDOR = 'vendedor'
    COMPRADOR = 'comprador'
    
    # Opções para o campo tipo_conta
    TIPO_CONTA_CHOICES = [
        (VENDEDOR, 'Vendedor'),
        (COMPRADOR, 'Comprador'),
    ]

    nome_completo = models.CharField(max_length=255)  # Nome completo do usuário
    telefone = models.CharField(max_length=15)  # Telefone para contato
    endereco = models.TextField(blank=True, null=True, default='Sem endereço informado')  # Endereço do usuário, pode ser vazio
    tipo_conta = models.CharField(
        max_length=20,
        choices=TIPO_CONTA_CHOICES,  # Define se é vendedor ou comprador
        default=COMPRADOR,
    )

    def __str__(self):
        # Representação do usuário como string, mostrando username, tipo e nome completo
        return f'{self.username} ({self.tipo_conta}) - {self.nome_completo}'

# Modelo para categorizar produtos
class Categoria(models.Model):
    nome = models.CharField(max_length=50, unique=True)  # Nome único da categoria

    def __str__(self):
        # Retorna o nome da categoria como representação textual
        return self.nome

# Modelo que representa um fornecedor externo ou parceiro
class Fornecedor(models.Model):
    nome = models.CharField(max_length=250)  # Nome do fornecedor
    email = models.EmailField(unique=True)  # Email único para contato
    telefone = models.CharField(max_length=11, blank=True, null=True)  # Telefone, opcional
    endereco = models.TextField(blank=True, null=True, default='Sem endereço informado')  # Endereço, opcional

    def __str__(self):
        # Retorna o nome do fornecedor
        return self.nome

# Modelo que representa um produto à venda
class Produto(models.Model):
    nome = models.CharField(max_length=250)  # Nome do produto
    descricao = models.TextField(blank=True, null=True)  # Descrição detalhada, opcional
    preco = models.DecimalField(max_digits=10, decimal_places=2)  # Preço do produto com 2 casas decimais
    quantidade_estoque = models.PositiveIntegerField()  # Quantidade disponível no estoque
    categoria = models.ForeignKey(Categoria, on_delete=models.CASCADE, related_name='produtos')  # Categoria associada, em cascata na exclusão
    fornecedor = models.ForeignKey(Usuario, on_delete=models.CASCADE, related_name='produtos')  # Usuário fornecedor do produto
    imagem = models.ImageField(upload_to='produtos/', blank=True, null=True)

    def __str__(self):
        # Retorna o nome do produto
        return self.nome

# Modelo que representa um pedido feito por um cliente
class Pedido(models.Model):
    cliente = models.ForeignKey(Usuario, on_delete=models.CASCADE, related_name='pedidos')  # Cliente que fez o pedido
    data = models.DateTimeField(auto_now_add=True)  # Data e hora em que o pedido foi criado, automático

    def __str__(self):
        # Representação textual com o ID do pedido e nome do cliente
        return f'Pedido #{self.id} - {self.cliente.nome_completo}'

# Modelo que representa um item dentro de um pedido
class ItemPedido(models.Model):
    pedido = models.ForeignKey(Pedido, on_delete=models.CASCADE, related_name='itens')  # Pedido ao qual o item pertence
    produto = models.ForeignKey(Produto, on_delete=models.CASCADE)  # Produto do item
    quantidade = models.PositiveIntegerField()  # Quantidade do produto no item
    preco_unitario = models.DecimalField(max_digits=10, decimal_places=2)  # Preço unitário na hora do pedido

    def subtotal(self):
        # Calcula o subtotal do item: quantidade * preço unitário
        return self.quantidade * self.preco_unitario

    def __str__(self):
        # Representação textual do item com quantidade, nome do produto e ID do pedido
        return f'{self.quantidade} x {self.produto.nome} - Pedido {self.pedido.id}'
    
class Carrinho(models.Model):
    usuario = models.OneToOneField(Usuario, on_delete=models.CASCADE, related_name='carrinho')
    criado_em = models.DateTimeField(auto_now_add=True)
    atualizado_em = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f'Carrinho de {self.usuario.username}'
    
    def total(self):
        return sum(item.subtotal() for item in self.itens.all())
    
class ItemCarrinho(models.Model):
    carrinho = models.ForeignKey(Carrinho, on_delete=models.CASCADE, related_name='itens')
    produto = models.ForeignKey(Produto, on_delete=models.CASCADE)
    quantidade = models.PositiveIntegerField(default=1)
    preco_unitario = models.DecimalField(max_digits=10, decimal_places=2)

    def subtotal(self):
        return self.quantidade * self.produto.preco
    
    def __str__(self):
        return f'{self.quantidade} x {self.produto.nome} - Carrinho de {self.carrinho.usuario.username}'
    
class ListaDesejos(models.Model):
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE, related_name='listaDesejos')
    produto = models.ForeignKey('Produto', on_delete=models.CASCADE)

    class Meta:
        unique_together = ('usuario', 'produto')

    def __str__(self):
        return f'{self.usuario.username} - {self.produto.nome}'

