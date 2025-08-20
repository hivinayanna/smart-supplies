from django.db import models
from django.contrib.auth.models import AbstractUser
from cloudinary.models import CloudinaryField

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

    def __str__(self): # Método que define como o usuário será exibido como texto
        return f'{self.username} ({self.tipo_conta}) - {self.nome_completo}'

# Modelo para categorizar produtos
class Categoria(models.Model):
    nome = models.CharField(max_length=50, unique=True) # Nome da categoria, único no banco

    def __str__(self):
        return self.nome

# Modelo que representa um produto à venda
class Produto(models.Model):
    nome = models.CharField(max_length=250)
    descricao = models.TextField(blank=True, null=True)
    preco = models.DecimalField(max_digits=10, decimal_places=2)
    quantidade_estoque = models.PositiveIntegerField()
    categoria = models.ForeignKey(Categoria, on_delete=models.CASCADE, related_name='produtos')
    fornecedor = models.ForeignKey(Usuario, on_delete=models.CASCADE, related_name='produtos')
    imagem = CloudinaryField('imagem', blank=True, null=True)

    def __str__(self):
        return self.nome

# Modelo que representa um pedido feito por um cliente
class Pedido(models.Model):
    cliente = models.ForeignKey(Usuario, on_delete=models.CASCADE, related_name='pedidos') # Cliente que fez o pedido
    data = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'Pedido #{self.id} - {self.cliente.nome_completo}'

# Modelo que representa um item dentro de um pedido
class ItemPedido(models.Model):
    pedido = models.ForeignKey(Pedido, on_delete=models.CASCADE, related_name='itens') # Pedido no qual pertence
    produto = models.ForeignKey(Produto, on_delete=models.CASCADE) # Produto associado ao item
    quantidade = models.PositiveIntegerField()
    preco_unitario = models.DecimalField(max_digits=10, decimal_places=2)

    def subtotal(self):
        return self.quantidade * self.preco_unitario

    def __str__(self):
        return f'{self.quantidade} x {self.produto.nome} - Pedido {self.pedido.id}'
    
class Carrinho(models.Model):
    usuario = models.OneToOneField(Usuario, on_delete=models.CASCADE, related_name='carrinho') # Cada usuário tem um carrinho único
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
        unique_together = ('usuario', 'produto') # Garante que o mesmo produto não seja adicionado duas vezes para o mesmo usuário

    def __str__(self):
        return f'{self.usuario.username} - {self.produto.nome}'
    
class Avaliacao(models.Model):
    produto = models.ForeignKey(Produto, on_delete=models.CASCADE, related_name='avaliacoes')
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE)
    nota = models.IntegerField()  # de 1 a 5
    comentario = models.TextField(blank=True)
    data = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('produto', 'usuario')
