import React, { useState } from 'react';
import '../../styles/produtoCard.css';
import { Link } from 'react-router-dom';

const host = import.meta.env.REACT_APP_HOST || "http://localhost:8000";
const ProdutoCard = ({ produto }) => {
    const [quantidade, setQuantidade] = useState(1);

    if (!produto) return null;

    const aumentar = () => setQuantidade((q) => q + 1);
    const diminuir = () => setQuantidade((q) => (q > 1 ? q - 1 : 1));
    const adicionarAoCarrinho = () => {
        alert(`Adicionado ${quantidade}x "${produto.nome}" ao carrinho!`);
    };

    return (
        <div className="produto-card">
            <Link>
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
                <button className="btn-carrinho" onClick={adicionarAoCarrinho}>
                    ADICIONAR AO CARRINHO
                </button>
            </div>
        </div>
    );
};

export default ProdutoCard;
