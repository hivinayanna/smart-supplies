from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import serializers
from .models import Usuario, Produto, Categoria, Pedido, ItemPedido, Carrinho, ItemCarrinho, ListaDesejos, Avaliacao
from PIL import Image, ImageOps
from django.core.files.uploadedfile import InMemoryUploadedFile
from pathlib import Path
import io

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        # Adiciona informações extras ao token (payload)
        token['tipo_conta'] = user.tipo_conta
        return token

    def validate(self, attrs):
        data = super().validate(attrs)
        # Adiciona informações extras na resposta do login
        data.update({
            'id': self.user.id,
            'username': self.user.username,
            'email': self.user.email,
            'nome_completo': self.user.nome_completo,
            'tipo_conta': self.user.tipo_conta,
        })
        return data

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
    categoria = CategoriaSerializer(read_only=True)
    categoria_id = serializers.PrimaryKeyRelatedField(queryset=Categoria.objects.all(), source='categoria', write_only=True)
    fornecedor = UsuarioSerializer(read_only=True)
    imagem = serializers.ImageField(required=False)

    class Meta:
        model = Produto
        fields = ['id', 'nome', 'descricao', 'preco', 'quantidade_estoque', 'categoria', 'categoria_id', 'fornecedor', 'imagem']

    def _resize_500(self, uploaded):
        img = Image.open(uploaded)
        img = ImageOps.exif_transpose(img)

        if img.mode in ('RGBA', 'P'):
            bg = Image.new('RGB', img.size, (255, 255, 255))
            if img.mode == 'RGBA':
                bg.paste(img, mask=img.split()[3])
            else:
                bg.paste(img)
            img = bg
        else:
            img = img.convert('RGB')

        img.thumbnail((500, 500), Image.Resampling.LANCZOS)

        buffer = io.BytesIO()
        img.save(buffer, format='JPEG', quality=85, optimize=True)
        buffer.seek(0)

        nome = f"{Path(uploaded.name).stem}.jpg"
        return InMemoryUploadedFile(
            buffer, field_name='ImageField', name=nome,
            content_type='image/jpeg', size=buffer.getbuffer().nbytes, charset=None
        )

    def validate_imagem(self, imagem):
        if imagem:
            return self._resize_500(imagem)
        return imagem

class ProdutoResumoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Produto
        fields = ['id','nome','preco']

# Serializer para itens de pedido
class ItemPedidoSerializer(serializers.ModelSerializer):
    produto = ProdutoResumoSerializer(read_only=True)
    produto_id = serializers.PrimaryKeyRelatedField(queryset=Produto.objects.all(), source='produto', write_only=True)
    subtotal = serializers.SerializerMethodField()

    class Meta:
        model = ItemPedido
        fields = ['id', 'produto', 'produto_id', 'quantidade', 'preco_unitario', 'subtotal']

    def get_subtotal(self, obj):
        return obj.quantidade * obj.preco_unitario
    
class ClienteResumoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = ['id', 'username', 'nome_completo']

# Serializer para pedidos
class PedidoSerializer(serializers.ModelSerializer):
    itens = ItemPedidoSerializer(many=True, read_only=True)
    cliente = ClienteResumoSerializer(read_only=True)
    valor_total = serializers.SerializerMethodField()

    class Meta:
        model = Pedido
        fields = ['id', 'cliente', 'data', 'itens', 'valor_total']

    def get_valor_total(self, obj):
        return sum(item.quantidade * item.preco_unitario for item in obj.itens.all())

    def create(self, validated_data):
        itens_data = validated_data.pop('itens')
        pedido = Pedido.objects.create(**validated_data)
        for item in itens_data:
            ItemPedido.objects.create(pedido=pedido, **item)
        return pedido

# Item do carrinho
class ItemCarrinhoSerializer(serializers.ModelSerializer):
    produto = ProdutoResumoSerializer(read_only=True)
    produto_id = serializers.PrimaryKeyRelatedField(
        queryset=Produto.objects.all(), source='produto', write_only=True
    )
    subtotal = serializers.SerializerMethodField()

    class Meta:
        model = ItemCarrinho
        fields = ['id', 'produto', 'produto_id', 'quantidade', 'preco_unitario', 'subtotal']

    def get_subtotal(self, obj):
        return obj.quantidade * obj.preco_unitario

# Carrinho
class CarrinhoSerializer(serializers.ModelSerializer):
    itens = ItemCarrinhoSerializer(many=True, read_only=True)
    total = serializers.SerializerMethodField()

    class Meta:
        model = Carrinho
        fields = ['id', 'usuario', 'criado_em', 'atualizado_em', 'itens', 'total']
        read_only_fields = ['usuario', 'criado_em', 'atualizado_em']

    def get_total(self, obj):
        return obj.total()

class ListaDesejosSerializer(serializers.ModelSerializer):
    produto = ProdutoSerializer(read_only=True)

    class Meta:
        model = ListaDesejos
        fields = ['id', 'produto']

class ListaDesejosSerializer(serializers.ModelSerializer):
    produto = ProdutoSerializer(read_only=True)
    estoque_produto = serializers.IntegerField(source='produto.quantidade_estoque', read_only=True)
    vendedor = serializers.CharField(source='produto.fornecedor.nome_completo', read_only=True)

    class Meta:
        model = ListaDesejos
        fields = ['id', 'produto', 'estoque_produto', 'vendedor']

# Atualizar perfil
class UsuarioUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = ['nome_completo','telefone','endereco','email']
