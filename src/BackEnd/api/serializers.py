from rest_framework import serializers
from .models import Usuario, Produto, Categoria, Pedido, ItemPedido, Fornecedor

# Serializer para exibir informações do usuário
class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = ['id', 'username', 'email', 'nome_completo', 'telefone', 'endereco', 'tipo_conta']

# Serializer para criação de novos usuários, com campo de senha write-only
class CreateUsuarioSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = Usuario
        fields = ['id', 'username', 'email', 'password', 'nome_completo', 'telefone', 'endereco', 'tipo_conta']

    # Método sobrescrito para usar create_user e garantir hash da senha
    def create(self, validated_data):
        user = Usuario.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            nome_completo=validated_data.get('nome_completo', ''),
            telefone=validated_data.get('telefone', ''),
            endereco=validated_data.get('endereco', ''),
            tipo_conta=validated_data.get('tipo_conta', Usuario.COMPRADOR)
        )
        return user

# Serializer para exibir categorias
class CategoriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categoria
        fields = ['id', 'nome']

# Serializer para exibir e criar produtos
class ProdutoSerializer(serializers.ModelSerializer):
    categoria = CategoriaSerializer(read_only=True)  # Representação detalhada da categoria (somente leitura)
    categoria_id = serializers.PrimaryKeyRelatedField(queryset=Categoria.objects.all(), source='categoria', write_only=True)  # ID usado na criação/edição
    fornecedor = UsuarioSerializer(read_only=True)  # Representação detalhada do fornecedor
    fornecedor_id = serializers.PrimaryKeyRelatedField(queryset=Usuario.objects.all(), source='fornecedor', write_only=True)  # ID usado na criação/edição

    class Meta:
        model = Produto
        fields = ['id', 'nome', 'descricao', 'preco', 'quantidade_estoque', 'categoria', 'categoria_id', 'fornecedor', 'fornecedor_id']

# Serializer para exibir fornecedores
class FornecedorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Fornecedor
        fields = ['id', 'nome', 'email', 'telefone', 'endereco']

# Serializer para itens de pedido
class ItemPedidoSerializer(serializers.ModelSerializer):
    class Meta:
        model = ItemPedido
        fields = ['id', 'produto', 'quantidade', 'preco_unitario', 'subtotal']

# Serializer para pedidos com criação customizada de itens
class PedidoSerializer(serializers.ModelSerializer):
    itens = ItemPedidoSerializer(many=True)  # Lista de itens incluídos no pedido

    class Meta:
        model = Pedido
        fields = ['id', 'cliente', 'data', 'itens']

    # Criação personalizada para salvar pedido e itens relacionados
    def create(self, validated_data):
        itens_data = validated_data.pop('itens')
        pedido = Pedido.objects.create(**validated_data)
        for item in itens_data:
            ItemPedido.objects.create(pedido=pedido, **item)
        return pedido
