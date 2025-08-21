from rest_framework_simplejwt.serializers import TokenObtainPairSerializer  # Serializer JWT padrão
from rest_framework import serializers  # Importa serializers do DRF
from .models import Usuario, Produto, Categoria, Pedido, ItemPedido, Carrinho, ItemCarrinho, ListaDesejos, Avaliacao  # Importa os modelos
from PIL import Image, ImageOps  # Para manipulação de imagens
from django.core.files.uploadedfile import InMemoryUploadedFile  # Para criar arquivos em memória
from pathlib import Path  # Para manipulação de paths
import io  # Para buffers de memória

# Serializer customizado para JWT
class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)  # Pega o token padrão
        token['tipo_conta'] = user.tipo_conta  # Adiciona info extra ao payload do token
        return token

    def validate(self, attrs):
        data = super().validate(attrs)  # Valida com o método original
        # Adiciona infos extras na resposta do login
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
        fields = ['id', 'username', 'email', 'nome_completo', 'telefone', 'endereco', 'tipo_conta']  # Campos retornados

# Serializer para criar novos usuários
class CreateUsuarioSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)  # Senha write-only

    class Meta:
        model = Usuario
        fields = ['id', 'username', 'email', 'password', 'nome_completo', 'telefone', 'endereco', 'tipo_conta']  

    def create(self, validated_data):  # Cria usuário com hash de senha
        user = Usuario.objects.create_user(  # Helper do Django para criar usuário seguro
            username=validated_data['username'],  # Define username
            email=validated_data['email'],  # Define email
            password=validated_data['password'],  # Hasheia senha automaticamente
            nome_completo=validated_data.get('nome_completo', ''),  # Campo opcional
            telefone=validated_data.get('telefone', ''),
            endereco=validated_data.get('endereco', ''),
            tipo_conta=validated_data.get('tipo_conta', Usuario.COMPRADOR)  # Default COMPRADOR
        )
        return user

# Serializer para categorias
class CategoriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categoria
        fields = ['id', 'nome']  # Apenas id e nome

# Serializer para produtos
class ProdutoSerializer(serializers.ModelSerializer):
    categoria = CategoriaSerializer(read_only=True)  # Exibe dados da categoria
    categoria_id = serializers.PrimaryKeyRelatedField(queryset=Categoria.objects.all(), source='categoria', write_only=True)  # Permite criar produto via ID
    fornecedor = UsuarioSerializer(read_only=True)  # Exibe dados do fornecedor
    imagem = serializers.ImageField(required=False)  # Imagem opcional

    class Meta:
        model = Produto
        fields = ['id', 'nome', 'descricao', 'preco', 'quantidade_estoque', 'categoria', 'categoria_id', 'fornecedor', 'imagem']

    def _resize_500(self, uploaded):  # Função interna para padronizar imagem
        img = Image.open(uploaded)  # Abre imagem
        img = ImageOps.exif_transpose(img)  # Corrige rotação EXIF

        if img.mode in ('RGBA', 'P'):  # Se tiver transparência ou paleta
            bg = Image.new('RGB', img.size, (255, 255, 255))  # Fundo branco
            if img.mode == 'RGBA':  # Se tiver canal alpha
                bg.paste(img, mask=img.split()[3])  # Cola imagem preservando transparência
            else:
                bg.paste(img)  # Cola direto no fundo
            img = bg
        else:
            img = img.convert('RGB')  # Garante RGB

        img.thumbnail((500, 500), Image.Resampling.LANCZOS)  # Reduz tamanho mantendo proporção

        buffer = io.BytesIO()  # Buffer em memória
        img.save(buffer, format='JPEG', quality=85, optimize=True)  # Salva JPEG otimizado
        buffer.seek(0)  # Reseta cursor do buffer

        nome = f"{Path(uploaded.name).stem}.jpg"  # Nome do arquivo final
        return InMemoryUploadedFile(  # Retorna arquivo em memória
            buffer,
            field_name='ImageField',
            name=nome,
            content_type='image/jpeg',
            size=buffer.getbuffer().nbytes,
            charset=None
        )

    def validate_imagem(self, imagem):  # Validação de imagem
        if imagem:
            return self._resize_500(imagem)  # Redimensiona
        return imagem

# Serializer resumido de produto
class ProdutoResumoSerializer(serializers.ModelSerializer):
    imagem = serializers.SerializerMethodField()

    class Meta:
        model = Produto
        fields = ['id', 'nome', 'preco', 'imagem']

    def get_imagem(self, obj):
        return obj.imagem.url if obj.imagem else None


# Serializer para itens de pedido
class ItemPedidoSerializer(serializers.ModelSerializer):
    produto = ProdutoResumoSerializer(read_only=True)  # Exibe dados do produto
    produto_id = serializers.PrimaryKeyRelatedField(queryset=Produto.objects.all(), source='produto', write_only=True)  # Permite criar via ID
    subtotal = serializers.SerializerMethodField()  # Campo calculado

    class Meta:
        model = ItemPedido
        fields = ['id', 'produto', 'produto_id', 'quantidade', 'preco_unitario', 'subtotal']

    def get_subtotal(self, obj):
        return obj.quantidade * obj.preco_unitario  # Calcula subtotal do item

# Serializer resumido de cliente
class ClienteResumoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = ['id', 'username', 'nome_completo']

# Serializer para pedidos
class PedidoSerializer(serializers.ModelSerializer):
    itens = ItemPedidoSerializer(many=True, read_only=True)  # Lista de itens do pedido
    cliente = ClienteResumoSerializer(read_only=True)  # Dados do cliente
    valor_total = serializers.SerializerMethodField()  # Calcula total do pedido

    class Meta:
        model = Pedido
        fields = ['id', 'cliente', 'data', 'itens', 'valor_total']

    def get_valor_total(self, obj):
        return sum(item.quantidade * item.preco_unitario for item in obj.itens.all())  # Soma subtotais

    def create(self, validated_data):  # Cria pedido com itens
        itens_data = validated_data.pop('itens')  # Remove itens dos dados principais
        pedido = Pedido.objects.create(**validated_data)  # Cria pedido
        for item in itens_data:
            ItemPedido.objects.create(pedido=pedido, **item)  # Cria cada item vinculado
        return pedido

# Serializer para itens de carrinho
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

# Serializer de carrinho
class CarrinhoSerializer(serializers.ModelSerializer):
    itens = ItemCarrinhoSerializer(many=True, read_only=True)
    total = serializers.SerializerMethodField()

    class Meta:
        model = Carrinho
        fields = ['id', 'usuario', 'criado_em', 'atualizado_em', 'itens', 'total']
        read_only_fields = ['usuario', 'criado_em', 'atualizado_em']

    def get_total(self, obj):
        return obj.total()  # Método total() do model

# Serializer para lista de desejos
class ListaDesejosSerializer(serializers.ModelSerializer):
    produto = ProdutoSerializer(read_only=True)

    class Meta:
        model = ListaDesejos
        fields = ['id', 'produto']

# Serializer expandido para lista de desejos
class ListaDesejosSerializer(serializers.ModelSerializer):
    produto = ProdutoSerializer(read_only=True)
    estoque_produto = serializers.IntegerField(source='produto.quantidade_estoque', read_only=True)
    vendedor = serializers.CharField(source='produto.fornecedor.nome_completo', read_only=True)

    class Meta:
        model = ListaDesejos
        fields = ['id', 'produto', 'estoque_produto', 'vendedor']

# Serializer para atualizar perfil
class UsuarioUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = ['nome_completo','telefone','endereco','email']  # Campos atualizáveis

class AvaliacaoSerializer(serializers.ModelSerializer):
    usuario = UsuarioSerializer(read_only=True)

    class Meta:
        model = Avaliacao
        fields = ['id', 'produto', 'usuario', 'nota', 'comentario', 'data']
