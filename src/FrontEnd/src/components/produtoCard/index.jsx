import React, { useState } from 'react';
import '../../styles/produtoCard.css';
import { Link } from 'react-router-dom';

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
                    src={produto.imagem || "https://via.placeholder.com/280x180.png?text=Produto"}
                    alt={produto.nome}
                />
            </Link>

            <div className="card-content">
                <h2>{produto.nome}</h2>
                <p><strong>Descrição:</strong> {produto.descricao || 'Sem descrição'}</p>
                <p><strong>Preço:</strong> R$ {produto.preco.toFixed(2)}</p>
                <p><strong>Estoque:</strong> {produto.quantidade_estoque}</p>
                <p><strong>Categoria:</strong> {produto.categoria?.nome}</p>
                <p><strong>Fornecedor:</strong> {produto.fornecedor?.nome}</p>
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
