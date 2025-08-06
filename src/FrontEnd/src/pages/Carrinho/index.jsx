import React, { useState, useEffect } from 'react';
import SideNavBar from '../../components/sideNavBar';
import CarrinhoItem from '../../components/carrinhoItem';
import CarrinhoResumo from '../../components/carrinhoResumo';
import Footer from '../../components/footer';
import '../../styles/carrinho.css';

/**
 * Página Carrinho - Página principal do carrinho de compras
 * 
 * Gerencia o estado do carrinho, permite modificar quantidades,
 * remover itens e finalizar compra.
 * 
 * @returns {JSX.Element} Elemento JSX da página do carrinho
 */
function Carrinho() {
    const [itensCarrinho, setItensCarrinho] = useState([]);
    const [loading, setLoading] = useState(true);

    // Simular carregamento dos itens do carrinho
    useEffect(() => {
        // Mock data - substituir por chamada à API
        const mockItens = [
            {
                id: 1,
                nome: "Coca-Cola Lata 350ml",
                preco: 3.50,
                quantidade: 2,
                quantidade_estoque: 50,
                imagem: "https://cdn.dooca.store/4309/products/701d27b0222a52d1980f7e84ff282b4c.jpg?v=1653064450",
                fornecedor: { nome: "Distribuidora ABC" }
            },
            {
                id: 2,
                nome: "Água Mineral 500ml",
                preco: 2.00,
                quantidade: 1,
                quantidade_estoque: 100,
                imagem: "https://cdn.dooca.store/4309/products/701d27b0222a52d1980f7e84ff282b4c.jpg?v=1653064450",
                fornecedor: { nome: "Águas do Brasil" }
            }
        ];

        setTimeout(() => {
            setItensCarrinho(mockItens);
            setLoading(false);
        }, 1000);
    }, []);

    // Handlers
    const handleUpdateQuantity = (itemId, novaQuantidade) => {
        setItensCarrinho(itens =>
            itens.map(item =>
                item.id === itemId
                    ? { ...item, quantidade: novaQuantidade }
                    : item
            )
        );
    };

    const handleRemoveItem = (itemId) => {
        setItensCarrinho(itens => itens.filter(item => item.id !== itemId));
    };

    const handleCheckout = (dadosCheckout) => {
        console.log('Finalizando compra:', dadosCheckout);
        alert(`Compra finalizada! Total: R$ ${dadosCheckout.total.toFixed(2)}`);
        // Aqui seria feita a integração com API de pagamento
    };

    if (loading) {
        return (
            <div className="carrinho-loading">
                <div className="loading-content">
                    <p>Carregando carrinho...</p>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <>
            <SideNavBar tipoUsuario="vendedor" />
            <div className="carrinho-layout">
                
                
                <main className="carrinho-main">
                    <div className="carrinho-header">
                        <h1>Meu Carrinho</h1>
                        <span className="itens-count">
                            {itensCarrinho.length} {itensCarrinho.length === 1 ? 'item' : 'itens'}
                        </span>
                    </div>

                    {itensCarrinho.length === 0 ? (
                        <div className="carrinho-vazio">
                            <h2>Seu carrinho está vazio</h2>
                            <p>Adicione produtos para começar suas compras</p>
                            <button className="btn-continuar-comprando">
                                Continuar Comprando
                            </button>
                        </div>
                    ) : (
                        <div className="carrinho-content">
                            <div className="carrinho-itens">
                                {itensCarrinho.map(item => (
                                    <CarrinhoItem
                                        key={item.id}
                                        item={item}
                                        onUpdateQuantity={handleUpdateQuantity}
                                        onRemove={handleRemoveItem}
                                    />
                                ))}
                            </div>

                            <div className="carrinho-sidebar">
                                <CarrinhoResumo
                                    itens={itensCarrinho}
                                    onCheckout={handleCheckout}
                                />
                            </div>
                        </div>
                    )}
                </main>
            </div>
            <Footer />
        </>
    );
}

export default Carrinho;