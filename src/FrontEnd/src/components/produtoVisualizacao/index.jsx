import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import '../../styles/produtoVisualizacao.css';

const host = import.meta.env.REACT_APP_HOST || "http://localhost:8000";

const ProdutoVisualizacao = ({ produtoId }) => {
    const [produto, setProduto] = useState(null);
    const [quantidade, setQuantidade] = useState(1);
    const [redirectToLogin, setRedirectToLogin] = useState(false);

    useEffect(() => {
        const fetchProduto = async () => {
            const token = sessionStorage.getItem("accessToken");
            if (!token) {
                setRedirectToLogin(true);
                return;
            }

            try {
                const response = await fetch(`${host}/api/produtos/${produtoId}/`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });

                if (response.status === 401) {
                    setRedirectToLogin(true);
                    return;
                }

                const produtoData = await response.json();
                setProduto(produtoData);
            } catch (error) {
                console.error("Erro ao buscar produto:", error);
            }
        };

        fetchProduto();
    }, [produtoId]);

    if (redirectToLogin) {
        return <Navigate to="/Auth?sessionExpired=true" replace />;
    }

    if (!produto) return <div>Carregando...</div>;

    const aumentar = () => setQuantidade(q => q + 1);
    const diminuir = () => setQuantidade(q => q > 1 ? q - 1 : 1);
    const adicionarAoCarrinho = () => {
        alert(`Adicionado ${quantidade}x "${produto.nome}" ao carrinho!`);
    };

    return (
        <div className="produto-visualizacao">
            <div className="produto-imagem">
                <img
                    src={produto.imagem ? `${host}/${produto.imagem}` : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcROJGo_BDmE1BQXej-UemTXxZG6RkDsA95ZnA&s"}
                    alt={produto.nome}
                />
            </div>
            <div className="produto-info">
                <h1>{produto.nome}</h1>
                <p className="produto-preco">R$ {produto.preco}</p>
                <p className="produto-descricao">{produto.descricao || 'Sem descrição'}</p>
                <p><strong>Estoque:</strong> {produto.quantidade_estoque}</p>
                <p><strong>Categoria:</strong> {produto.categoria?.nome}</p>
                <p><strong>Fornecedor:</strong> {produto.fornecedor?.username}</p>
                
                <div className="produto-compra">
                    <div className="quantidade-controls">
                        <button onClick={diminuir}>−</button>
                        <input
                            type="number"
                            value={quantidade}
                            onChange={(e) => setQuantidade(Math.max(1, Number(e.target.value)))}
                            min="1"
                        />
                        <button onClick={aumentar}>+</button>
                    </div>
                    <button className="btn-carrinho" onClick={adicionarAoCarrinho}>
                        ADICIONAR AO CARRINHO
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProdutoVisualizacao;