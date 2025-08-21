import React from 'react';
import PropTypes from 'prop-types';
import '../../styles/carrinhoItem.css';

// Constantes
const PLACEHOLDER_IMAGE = "https://res.cloudinary.com/dj5eeszbx/image/upload/v1755180798/sem_imagem_o3vo3n.png";
const MIN_QUANTITY = 1;

/**
 * Componente CarrinhoItem - Item individual do carrinho de compras
 * 
 * @param {Object} item - Item do carrinho
 * @param {Function} onUpdateQuantity - Callback para atualizar quantidade
 * @param {Function} onRemove - Callback para remover item
 * @returns {JSX.Element} Elemento JSX do item do carrinho
 */
const CarrinhoItem = ({ item, onUpdateQuantity, onRemove }) => {
    if (!item) return null;

    // Handlers
    const aumentar = () => onUpdateQuantity(item.id, item.quantidade + 1);
    const diminuir = () => onUpdateQuantity(item.id, Math.max(MIN_QUANTITY, item.quantidade - 1));
    const handleQuantityChange = (e) => {
        const newQuantity = Math.max(MIN_QUANTITY, Number(e.target.value));
        onUpdateQuantity(item.id, newQuantity);
    };
    const handleRemove = () => onRemove(item.id);

    const subtotal = item.preco * item.quantidade;

    return (
        <div className="carrinho-item">
            <div className="item-image">
                <img
                    src={item.produto?.imagem || PLACEHOLDER_IMAGE}
                    alt={item.produto?.nome || item.nome}
                    loading="lazy"
                />
            </div>

            <div className="item-details">
                <h3>{item.nome}</h3>
                <p className="item-fornecedor">{item.fornecedor?.nome}</p>
                <p className="item-preco">R$ {item.preco.toFixed(2)}</p>
            </div>

            <div className="item-controls">
                <div className="quantidade-controls">
                    <button onClick={diminuir} disabled={item.quantidade <= MIN_QUANTITY}>−</button>
                    <input
                        type="number"
                        value={item.quantidade}
                        onChange={handleQuantityChange}
                        min={MIN_QUANTITY}
                        max={item.quantidade_estoque}
                    />
                    <button onClick={aumentar}>+</button> {/*disabled={item.quantidade >= item.quantidade_estoque}*/}

                </div>
                
                <div className="item-subtotal">
                    <strong>R$ {subtotal.toFixed(2)}</strong>
                </div>

                <button className="btn-remove" onClick={handleRemove}>
                    🗑️
                </button>
            </div>
        </div>
    );
};

// PropTypes
CarrinhoItem.propTypes = {
    item: PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        nome: PropTypes.string.isRequired,
        preco: PropTypes.number.isRequired,
        quantidade: PropTypes.number.isRequired,
        quantidade_estoque: PropTypes.number.isRequired,
        imagem: PropTypes.string,
        fornecedor: PropTypes.shape({
            nome: PropTypes.string
        })
    }).isRequired,
    onUpdateQuantity: PropTypes.func.isRequired,
    onRemove: PropTypes.func.isRequired
};

export default CarrinhoItem;