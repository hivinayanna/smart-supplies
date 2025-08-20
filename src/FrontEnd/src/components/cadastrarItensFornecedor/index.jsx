import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import '../../styles/cadastrarItensFornecedor.css';
import { validarCampo, mensagensErro, aplicarMascara } from '../../utils/validacao';

/**
 * Componente CadastrarItensFornecedor - Formulário para cadastrar novos produtos
 * 
 * @param {Function} onAddProduto - Callback para adicionar novo produto
 * @returns {JSX.Element} Elemento JSX do formulário de cadastro
 */
const CadastrarItensFornecedor = ({ onAddProduto, mostrarNotificacao }) => {
    const [categorias, setCategorias] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = sessionStorage.getItem("accessToken");
                const host = import.meta.env.REACT_APP_HOST || "http://localhost:8000";
                if (!token) {
                    setRedirectToLogin(true);
                    return;
                }
                const response = await fetch(`${host}/api/categorias/`, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });

                let categorias = await response.json()
                console.log("Categorias: ", categorias)

                setTimeout(() => {
                    setCategorias(categorias);
                }, 100);
            } catch (error){
                console.error("Erro ao carregar categorias:", error);
            }
        }
        fetchData();
    }, []);

    const [formData, setFormData] = useState({
        nome: '',
        descricao: '',
        preco: '',
        quantidade_estoque: '',
        categoria: '',
        imagem: null
    });
    const [loading, setLoading] = useState(false);

    // Handler para mudanças nos inputs
    const handleChange = (e) => {
        const { name, value } = e.target;
        console.log("Labubu morango do amor", value)
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Handler para submit do formulário
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validações
        if (!validarCampo('nomeProduto', formData.nome)) {
            mostrarNotificacao(mensagensErro.nomeProduto, 'error');
            return;
        }
        if (!validarCampo('preco', formData.preco)) {
            mostrarNotificacao(mensagensErro.preco, 'error');
            return;
        }
        if (!validarCampo('estoque', formData.quantidade_estoque)) {
            mostrarNotificacao(mensagensErro.estoque, 'error');
            return;
        }
        setLoading(true);

        try {
            // Criar FormData para envio com arquivo
            const formDataToSend = new FormData();
            formDataToSend.append('nome', formData.nome);
            formDataToSend.append('descricao', formData.descricao);
            formDataToSend.append('preco', parseFloat(formData.preco.replace('R$ ', '').replace(',', '.')));
            formDataToSend.append('quantidade_estoque', parseInt(formData.quantidade_estoque));
            formDataToSend.append('categoria_id', formData.categoria);
            if (formData.imagem) {
                formDataToSend.append('imagem', formData.imagem);
            }

            await onAddProduto(formDataToSend);
            
            // Limpar formulário
            // setFormData({
            //     nome: '',
            //     descricao: '',
            //     preco: '',
            //     quantidade_estoque: '',
            //     categoria: '',
            //     imagem: null
            // });

            mostrarNotificacao('Produto cadastrado com sucesso!', 'success');
        } catch (error) {
            console.error('Erro ao cadastrar produto:', error);
            mostrarNotificacao('Erro ao cadastrar produto. Tente novamente.', 'error');
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
                            onChange={(e) => setFormData(prev => ({...prev, nome: aplicarMascara('nomeProduto', e.target.value)}))}
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
                            {categorias.map(categoria => (
                                <option key={categoria.id} value={categoria.id}>
                                    {categoria.nome}
                                </option>
                            ))}
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
                            type="text"
                            id="preco"
                            name="preco"
                            value={formData.preco}
                            onChange={(e) => setFormData(prev => ({...prev, preco: aplicarMascara('preco', e.target.value)}))}
                            required
                            placeholder="R$ 0.00"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="quantidade_estoque">Quantidade em Estoque *</label>
                        <input
                            type="text"
                            id="quantidade_estoque"
                            name="quantidade_estoque"
                            value={formData.quantidade_estoque}
                            onChange={(e) => setFormData(prev => ({...prev, quantidade_estoque: aplicarMascara('estoque', e.target.value)}))}
                            required
                            placeholder="0"
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="imagem">Imagem do Produto</label>
                    <input
                        type="file"
                        id="imagem"
                        name="imagem"
                        accept="image/*"
                        onChange={(e) => setFormData(prev => ({...prev, imagem: e.target.files[0]}))}
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