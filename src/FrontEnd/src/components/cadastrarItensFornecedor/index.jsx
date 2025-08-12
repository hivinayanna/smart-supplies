import React, { useState } from 'react';
import PropTypes from 'prop-types';
import '../../styles/cadastrarItensFornecedor.css';

/**
 * Componente CadastrarItensFornecedor - Formulário para cadastrar novos produtos
 * 
 * @param {Function} onAddProduto - Callback para adicionar novo produto
 * @returns {JSX.Element} Elemento JSX do formulário de cadastro
 */
const CadastrarItensFornecedor = ({ onAddProduto }) => {
    const [formData, setFormData] = useState({
        nome: '',
        descricao: '',
        preco: '',
        quantidade_estoque: '',
        categoria: '',
        imagem: ''
    });
    const [loading, setLoading] = useState(false);

    // Handler para mudanças nos inputs
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Handler para submit do formulário
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const novoProduto = {
                id: Date.now(), // ID temporário
                ...formData,
                preco: parseFloat(formData.preco),
                quantidade_estoque: parseInt(formData.quantidade_estoque),
                data_cadastro: new Date().toISOString()
            };

            await onAddProduto(novoProduto);
            
            // Limpar formulário
            setFormData({
                nome: '',
                descricao: '',
                preco: '',
                quantidade_estoque: '',
                categoria: '',
                imagem: ''
            });

            alert('Produto cadastrado com sucesso!');
        } catch (error) {
            console.error('Erro ao cadastrar produto:', error);
            alert('Erro ao cadastrar produto. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="cadastrar-itens">
            <h2>Cadastrar Novo Produto</h2>
            
            <form onSubmit={handleSubmit} className="cadastro-form">
                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="nome">Nome do Produto *</label>
                        <input
                            type="text"
                            id="nome"
                            name="nome"
                            value={formData.nome}
                            onChange={handleChange}
                            required
                            placeholder="Ex: Coca-Cola Lata 350ml"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="categoria">Categoria *</label>
                        <select
                            id="categoria"
                            name="categoria"
                            value={formData.categoria}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Selecione uma categoria</option>
                            <option value="bebidas">Bebidas</option>
                            <option value="alimentos">Alimentos</option>
                            <option value="limpeza">Limpeza</option>
                            <option value="higiene">Higiene</option>
                            <option value="outros">Outros</option>
                        </select>
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="descricao">Descrição</label>
                    <textarea
                        id="descricao"
                        name="descricao"
                        value={formData.descricao}
                        onChange={handleChange}
                        rows="3"
                        placeholder="Descreva seu produto..."
                    />
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="preco">Preço (R$) *</label>
                        <input
                            type="number"
                            id="preco"
                            name="preco"
                            value={formData.preco}
                            onChange={handleChange}
                            step="0.01"
                            min="0"
                            required
                            placeholder="0.00"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="quantidade_estoque">Quantidade em Estoque *</label>
                        <input
                            type="number"
                            id="quantidade_estoque"
                            name="quantidade_estoque"
                            value={formData.quantidade_estoque}
                            onChange={handleChange}
                            min="0"
                            required
                            placeholder="0"
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="imagem">URL da Imagem</label>
                    <input
                        type="url"
                        id="imagem"
                        name="imagem"
                        value={formData.imagem}
                        onChange={handleChange}
                        placeholder="https://exemplo.com/imagem.jpg"
                    />
                </div>

                <button 
                    type="submit" 
                    className="btn-cadastrar"
                    disabled={loading}
                >
                    {loading ? 'Cadastrando...' : 'Cadastrar Produto'}
                </button>
            </form>
        </div>
    );
};

// PropTypes
CadastrarItensFornecedor.propTypes = {
    onAddProduto: PropTypes.func.isRequired
};

export default CadastrarItensFornecedor;