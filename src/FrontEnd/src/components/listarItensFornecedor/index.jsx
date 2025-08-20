import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import '../../styles/listarItensFornecedor.css';

// Constantes
const PLACEHOLDER_IMAGE = "https://via.placeholder.com/150x150.png?text=Produto";
const API_BASE_URL = 'http://localhost:8000/api';

/**
 * Componente ListarItensFornecedor - Lista produtos cadastrados pelo fornecedor
 * 
 * @param {Array} produtos - Lista de produtos
 * @param {Function} onEditProduto - Callback para editar produto
 * @param {Function} onDeleteProduto - Callback para deletar produto
 * @returns {JSX.Element} Elemento JSX da lista de produtos
 */
const ListarItensFornecedor = ({ produtos, onEditProduto, onDeleteProduto }) => {
    const [filtro, setFiltro] = useState('');
    const [categoriaFiltro, setCategoriaFiltro] = useState('');
    const [categorias, setCategorias] = useState([]);
    const [modalAberto, setModalAberto] = useState(false);
    const [produtoEditando, setProdutoEditando] = useState(null);
    const [formData, setFormData] = useState({});

    // Buscar categorias do backend
    useEffect(() => {
        const fetchCategorias = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/categorias/`);
                setCategorias(response.data);
            } catch (error) {
                console.error('Erro ao buscar categorias:', error);
            }
        };
        fetchCategorias();
    }, []);

    // Filtrar produtos
    const produtosFiltrados = produtos.filter(produto => {
        const matchNome = produto.nome?.toLowerCase().includes(filtro.toLowerCase());
        const matchCategoria = categoriaFiltro === '' || produto.categoria?.id.toString() === categoriaFiltro;
        return matchNome && matchCategoria;
    });

    // Handler para abrir modal de edição
    const handleEdit = (produto) => {
        setProdutoEditando(produto);
        setFormData({
            nome: produto.nome,
            descricao: produto.descricao || '',
            preco: produto.preco.toString(),
            quantidade_estoque: produto.quantidade_estoque.toString(),
            categoria_id: produto.categoria.id,
            imagem: produto.imagem || ''
        });
        setModalAberto(true);
    };

    // Handler para mudanças no formulário
    const handleFormChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'imagem' && files) {
            setFormData(prev => ({ ...prev, [name]: files[0] }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    // Handler para salvar edição
    const handleSalvarEdicao = (e) => {
        e.preventDefault();
        const formDataToSend = new FormData();
        formDataToSend.append('nome', formData.nome);
        formDataToSend.append('descricao', formData.descricao);
        formDataToSend.append('preco', parseFloat(formData.preco));
        formDataToSend.append('quantidade_estoque', parseInt(formData.quantidade_estoque));
        formDataToSend.append('categoria_id', formData.categoria_id);
        if (formData.imagem instanceof File) {
            formDataToSend.append('imagem', formData.imagem);
        }
        onEditProduto(produtoEditando.id, formDataToSend);
        setModalAberto(false);
        setProdutoEditando(null);
    };

    // Handler para fechar modal
    const handleFecharModal = () => {
        setModalAberto(false);
        setProdutoEditando(null);
        setFormData({});
    };

    // Handler para deletar produto
    const handleDelete = (produtoId) => {
        if (window.confirm('Tem certeza que deseja excluir este produto?')) {
            onDeleteProduto(produtoId);
        }
    };

    if (produtos.length === 0) {
        return (
            <div className="listar-itens">
                <h2>Meus Produtos</h2>
                <div className="produtos-vazio">
                    <p>Você ainda não cadastrou nenhum produto.</p>
                    <p>Use o formulário acima para adicionar seu primeiro produto!</p>
                </div>
            </div>
        );
    }

    return (
        <div className="listar-itens">
            <div className="lista-header">
                <h2>Meus Produtos ({produtos.length})</h2>
                
                <div className="filtros">
                    <input
                        type="text"
                        placeholder="Buscar produtos..."
                        value={filtro}
                        onChange={(e) => setFiltro(e.target.value)}
                        className="filtro-busca"
                    />
                    
                    <select
                        value={categoriaFiltro}
                        onChange={(e) => setCategoriaFiltro(e.target.value)}
                        className="filtro-categoria"
                    >
                        <option value="">Todas as categorias</option>
                        {categorias.map(categoria => (
                            <option key={categoria.id} value={categoria.id}>
                                {categoria.nome}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="produtos-grid">
                {produtosFiltrados.map(produto => (
                    <div key={produto.id} className="produto-item">
                        <div className="produto-imagem">
                            <img
                                src={produto.imagem || PLACEHOLDER_IMAGE}
                                alt={produto.nome}
                                loading="lazy"
                            />
                        </div>

                        <div className="produto-info">
                            <h3>{produto.nome}</h3>
                            <p className="produto-categoria">{produto.categoria?.nome}</p>
                            <p className="produto-descricao">
                                {produto.descricao || 'Sem descrição'}
                            </p>
                            
                            <div className="produto-detalhes">
                                <span className="produto-preco">R$ {produto.preco}</span> {/*.toFixed(2)*/}
                                <span className="produto-estoque">
                                    Estoque: {produto.quantidade_estoque}
                                </span>
                            </div>
                        </div>

                        <div className="produto-acoes">
                            <button
                                className="btn-editar"
                                onClick={() => handleEdit(produto)}
                                title="Editar produto"
                            >
                                ✏️
                            </button>
                            <button
                                className="btn-deletar"
                                onClick={() => handleDelete(produto.id)}
                                title="Excluir produto"
                            >
                                🗑️
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {produtosFiltrados.length === 0 && produtos.length > 0 && (
                <div className="sem-resultados">
                    <p>Nenhum produto encontrado com os filtros aplicados.</p>
                </div>
            )}

            {/* Modal de Edição */}
            {modalAberto && (
                <div className="modal-overlay" onClick={handleFecharModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Editar Produto</h3>
                            <button className="btn-fechar" onClick={handleFecharModal}>×</button>
                        </div>

                        <form onSubmit={handleSalvarEdicao} className="modal-form">
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Nome do Produto *</label>
                                    <input
                                        type="text"
                                        name="nome"
                                        value={formData.nome}
                                        onChange={handleFormChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Categoria *</label>
                                    <select
                                        name="categoria_id"
                                        value={formData.categoria_id}
                                        onChange={handleFormChange}
                                        required
                                    >
                                        {categorias.map(categoria => (
                                            <option key={categoria.id} value={categoria.id}>
                                                {categoria.nome}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Descrição</label>
                                <textarea
                                    name="descricao"
                                    value={formData.descricao}
                                    onChange={handleFormChange}
                                    rows="3"
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Preço (R$) *</label>
                                    <input
                                        type="number"
                                        name="preco"
                                        value={formData.preco}
                                        onChange={handleFormChange}
                                        step="0.01"
                                        min="0"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Estoque *</label>
                                    <input
                                        type="number"
                                        name="quantidade_estoque"
                                        value={formData.quantidade_estoque}
                                        onChange={handleFormChange}
                                        min="0"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Imagem do Produto</label>
                                <input
                                    type="file"
                                    name="imagem"
                                    accept="image/*"
                                    onChange={handleFormChange}
                                />
                            </div>

                            <div className="modal-actions">
                                <button type="button" className="btn-cancelar" onClick={handleFecharModal}>
                                    Cancelar
                                </button>
                                <button type="submit" className="btn-salvar">
                                    Salvar Alterações
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

// PropTypes
ListarItensFornecedor.propTypes = {
    produtos: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        nome: PropTypes.string.isRequired,
        descricao: PropTypes.string,
        preco: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        quantidade_estoque: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        categoria: PropTypes.object.isRequired,
        imagem: PropTypes.string
    })).isRequired,
    onEditProduto: PropTypes.func.isRequired,
    onDeleteProduto: PropTypes.func.isRequired
};

export default ListarItensFornecedor;