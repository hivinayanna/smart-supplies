import React from 'react';
import PropTypes from 'prop-types';
import '../../styles/favoriteCard.css';
import { Link } from 'react-router-dom';

// Constantes
const PLACEHOLDER_IMAGE = "https://via.placeholder.com/280x180.png?text=Produto";

/**
 * Componente FavoriteCard - Card de produto favorito
 * 
 * @param {Object} produto - Dados do produto
 * @param {Function} onRemoveFavorite - Callback para remover dos favoritos
 * @returns {JSX.Element} Elemento JSX do card de favorito
 */
const FavoriteCard = ({ produto, onRemoveFavorite }) => {
    if (!produto) {
        return <div className="favorite-card-error">Produto não encontrado</div>;
    }

    // Handler para remover dos favoritos
    const handleRemoveFavorite = () => {
        onRemoveFavorite(produto.produto.id);
    };

    return (
        <div className="favorite-card">
            <div className="image-container">
                <Link to={`/produto/${produto.id}`}>
                    <img
                        src={produto.produto.imagem || PLACEHOLDER_IMAGE}
                        alt={produto.produto.nome}
                        loading="lazy"
                    />
                </Link>
                
                <button 
                    className="btn-remove-favorite" 
                    onClick={handleRemoveFavorite}
                    title="Remover dos favoritos"
                >
                    <span className="heart-icon">❤️</span>
                    <span className="heart-broken">💔</span>
                </button>
            </div>

            <div className="card-content">
                <h2>{produto.nome}</h2>
                <p><strong>Descrição:</strong> {produto.produto.descricao || 'Sem descrição'}</p>
                <p><strong>Preço:</strong> R$ {produto.produto.preco}</p> {/*.toFixed(2)*/}
                <p><strong>Estoque:</strong> {produto.estoque_produto}</p>
                <p><strong>Categoria:</strong> {produto.produto.categoria?.nome}</p>
                <p><strong>Fornecedor:</strong> {produto.produto.fornecedor?.username}</p>
            </div>


        </div>
    );
};

// PropTypes
FavoriteCard.propTypes = {
    produto: PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        nome: PropTypes.string.isRequired,
        descricao: PropTypes.string,
        preco: PropTypes.number.isRequired,
        quantidade_estoque: PropTypes.number.isRequired,
        imagem: PropTypes.string,
        categoria: PropTypes.shape({
            nome: PropTypes.string
        }),
        fornecedor: PropTypes.shape({
            nome: PropTypes.string
        })
    }).isRequired,
    onRemoveFavorite: PropTypes.func.isRequired
};

export default FavoriteCard;