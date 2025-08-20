import React, { useState } from 'react';
import { Navigate } from "react-router-dom";
import '../../styles/produtoCard.css';
import { Link } from 'react-router-dom';

const host = import.meta.env.REACT_APP_HOST || "http://localhost:8000";
const ProdutoCard = ({ produto, mostrarNotificacao }) => {
    const [redirectToLogin, setRedirectToLogin] = useState(false);
    const [quantidade, setQuantidade] = useState(1);
    const [isFavorito, setIsFavorito] = useState(false);
    const host = import.meta.env.REACT_APP_HOST || "http://localhost:8000";

    if (!produto) {
        console.log('Produto não encontrado:', produto);
        return null;
    }

    const aumentar = () => setQuantidade((q) => q + 1);
    const diminuir = () => setQuantidade((q) => (q > 1 ? q - 1 : 1));

    const token = sessionStorage.getItem("accessToken");

    if (!token) {
        setRedirectToLogin(true);
        return;
    }
    
   const toggleFavorito = async () => {
    try {
        if (isFavorito) {
            // Remove dos favoritos - DELETE
            await fetch(`${host}/api/lista-desejos/${produto.id}/`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
        } else {
            // Adiciona aos favoritos - POST
            await fetch(`${host}/api/lista-desejos/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ produto_id: produto.id })
            });
        }

        setIsFavorito(!isFavorito);
        mostrarNotificacao(
            isFavorito ? 'Removido da lista de desejos!' : 'Adicionado a lista de desejos!',
            'success'
        );
    } catch(error) {
        mostrarNotificacao(`Erro ao adicionar/remover dos favoritos: ${error}`, 'error');
    }
};

    const adicionarAoCarrinho = async () => {
        if (produto.quantidade_estoque === 0) {
            mostrarNotificacao('Produto sem estoque!', 'error');
            return;
        }
        
        try {
            const token = sessionStorage.getItem("accessToken");
            
            console.log(`body carrinho: ${JSON.stringify({ produto_id: produto.id, quantidade })}`)
            await fetch(`${host}/api/carrinho/adicionar/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ produto_id: produto.id, quantidade })
            });
            
            mostrarNotificacao(`Adicionado ${quantidade}x "${produto.nome}" ao carrinho!`, 'success');
        } catch (error) {
            mostrarNotificacao('Erro ao adicionar ao carrinho', 'error');
        }
    };

    if (redirectToLogin) {
        return <Navigate to="/Auth?sessionExpired=true" replace />;
    }

    return (
        <div className="produto-card">
            <div className="card-image-container">
                <Link to={`/produto/${produto.id}`}>
                    <img
                        src={produto.imagem || "https://res.cloudinary.com/dj5eeszbx/image/upload/v1755180798/sem_imagem_o3vo3n.png"}
                        alt={produto.nome}
                    />
                </Link>
                <button className={`btn-favorito ${isFavorito ? 'favorito' : ''}`} onClick={toggleFavorito}>
                    ♥
                </button>
            </div>

            <div className="card-content">
                <h2>{produto.nome}</h2>
                <p><strong>Descrição:</strong> {produto.descricao || 'Sem descrição'}</p>
                <p><strong>Preço:</strong> R$ {produto.preco}</p>
                <p><strong>Estoque:</strong> {produto.quantidade_estoque}</p>
                <p><strong>Categoria:</strong> {produto.categoria?.nome}</p>
                <p><strong>Fornecedor:</strong> {produto.fornecedor?.username}</p>
            </div>

            <div className="card-footer">
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
                <button 
                    className="btn-carrinho" 
                    onClick={adicionarAoCarrinho}
                    disabled={produto.quantidade_estoque === 0}
                >
                    {produto.quantidade_estoque === 0 ? 'SEM ESTOQUE' : 'ADICIONAR AO CARRINHO'}
                </button>
            </div>

        </div>
    );
};

export default ProdutoCard;
