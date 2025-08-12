import React, { useState } from 'react';
import { Navigate } from "react-router-dom";
import '../../styles/produtoCard.css';
import { Link } from 'react-router-dom';

const host = import.meta.env.REACT_APP_HOST || "http://localhost:8000";
const ProdutoCard = ({ produto }) => {
    const [redirectToLogin, setRedirectToLogin] = useState(false);
    const [quantidade, setQuantidade] = useState(1);

    if (!produto) {
        console.log('Produto não encontrado:', produto);
        return null;
    }

    const aumentar = () => setQuantidade((q) => q + 1);
    const diminuir = () => setQuantidade((q) => (q > 1 ? q - 1 : 1));
    const adicionarAoCarrinho = async () => {
        if (produto.quantidade_estoque === 0) {
            alert('Produto sem estoque!');
            return;
        }
        
        try {
            const host = import.meta.env.REACT_APP_HOST || "http://localhost:8000";
            const token = sessionStorage.getItem("accessToken");

            if (!token) {
                // Se não houver token, redireciona para a página de login
                setRedirectToLogin(true);
                return;
            }
            
            const novoEstoque = produto.quantidade_estoque - quantidade;
            console.log(`PUT BODY: ${JSON.stringify({
                    nome: produto.nome,
                    descricao: produto.descricao,
                    preco: produto.preco,
                    quantidade_estoque: novoEstoque,
                    categoria_id: produto.categoria.id,
                    fornecedor_id: produto.fornecedor.id
                })}`)
            await fetch(`${host}/api/produtos/${produto.id}/`, {
                method: 'PUT',
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json' 
                },
                body: JSON.stringify({
                    nome: produto.nome,
                    descricao: produto.descricao,
                    preco: produto.preco,
                    quantidade_estoque: novoEstoque,
                    categoria_id: produto.categoria.id,
                    fornecedor_id: produto.fornecedor.id
                })
            });
            console.log(`body carrinho: ${JSON.stringify({ produto_id: produto.id, quantidade })}`)
            await fetch('http://127.0.0.1:8000/api/carrinho/adicionar/', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ produto_id: produto.id, quantidade })
            });
            
            alert(`Adicionado ${quantidade}x "${produto.nome}" ao carrinho!`);
        } catch (error) {
            alert('Erro ao adicionar ao carrinho');
        }
    };

    if (redirectToLogin) {
        return <Navigate to="/Auth?sessionExpired=true" replace />;
    }

    return (
        <div className="produto-card">
            <Link to={`/produto/${produto.id}`}>
                <img
                    src={produto.imagem ? `${host}/${produto.imagem}` : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcROJGo_BDmE1BQXej-UemTXxZG6RkDsA95ZnA&s"}
                    alt={produto.nome}
                />
            </Link>

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
