import React from 'react';
import PropTypes from 'prop-types';
import '../../styles/carrinhoResumo.css';

// Constantes
const TAXA_ENTREGA = 10.00;
const FRETE_GRATIS_MINIMO = 100.00;

/**
 * Componente CarrinhoResumo - Resumo do pedido com totais e checkout
 * 
 * @param {Array} itens - Lista de itens do carrinho
 * @param {Function} onCheckout - Callback para finalizar compra
 * @returns {JSX.Element} Elemento JSX do resumo do carrinho
 */
const CarrinhoResumo = ({ itens, onCheckout }) => {
    if (!itens || itens.length === 0) {
        return (
            <div className="carrinho-resumo">
                <h3>Resumo do Pedido</h3>
                <p className="carrinho-vazio">Seu carrinho está vazio</p>
            </div>
        );
    }

    // Cálculos
    const subtotal = itens.reduce((total, item) => total + (item.preco * item.quantidade), 0);
    const freteGratis = subtotal >= FRETE_GRATIS_MINIMO;
    const frete = freteGratis ? 0 : TAXA_ENTREGA;
    const total = subtotal + frete;
    const totalItens = itens.reduce((total, item) => total + item.quantidade, 0);

    const handleCheckout = () => {
        onCheckout({ itens, subtotal, frete, total });
    };

    return (
        <div className="carrinho-resumo">
            <h3>Resumo do Pedido</h3>
            
            <div className="resumo-linha">
                <span>Itens ({totalItens})</span>
                <span>R$ {subtotal.toFixed(2)}</span>
            </div>

            <div className="resumo-linha">
                <span>Frete</span>
                <span className={freteGratis ? 'frete-gratis' : ''}>
                    {freteGratis ? 'GRÁTIS' : `R$ ${frete.toFixed(2)}`}
                </span>
            </div>

            {!freteGratis && (
                <div className="frete-info">
                    <small>
                        Frete grátis em compras acima de R$ {FRETE_GRATIS_MINIMO.toFixed(2)}
                    </small>
                </div>
            )}

            <div className="resumo-divider"></div>

            <div className="resumo-total">
                <strong>
                    <span>Total</span>
                    <span>R$ {total.toFixed(2)}</span>
                </strong>
            </div>

            <button 
                className="btn-checkout" 
                onClick={handleCheckout}
                disabled={itens.length === 0}
            >
                Finalizar Compra
            </button>

            <div className="resumo-info">
                <small>✓ Compra 100% segura</small>
                <small>✓ Entrega garantida</small>
            </div>
        </div>
    );
};

// PropTypes
CarrinhoResumo.propTypes = {
    itens: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        preco: PropTypes.number.isRequired,
        quantidade: PropTypes.number.isRequired
    })).isRequired,
    onCheckout: PropTypes.func.isRequired
};

export default CarrinhoResumo;