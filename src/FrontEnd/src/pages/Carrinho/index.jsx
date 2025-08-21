import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import SideNavBar from '../../components/sideNavBar';
import CarrinhoItem from '../../components/carrinhoItem';
import CarrinhoResumo from '../../components/carrinhoResumo';
import Notificacao from '../../components/notificacao';
import { useNotificacao } from '../../hooks/useNotificacao';
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
    const [redirectToLogin, setRedirectToLogin] = useState(false);
    const { notificacao, mostrarNotificacao, fecharNotificacao } = useNotificacao();
    const host = import.meta.env.REACT_APP_HOST || "http://localhost:8000";
    const token = sessionStorage.getItem("accessToken");

    useEffect(() => {
        const fetchData = async () => {

            if (!token) {
                setRedirectToLogin(true);
                return;
            }

            try {
                const response = await fetch(`${host}/api/carrinho/`, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });

                if (response.status === 401) {
                    console.log("Unauthorized login");
                    setRedirectToLogin(true);
                    return;
                }

                let carrinho_json = await response.json();
                console.log('Resposta da API:', carrinho_json);
                
                // Verificar se é array ou objeto com propriedade itens
                let itensArray = Array.isArray(carrinho_json) ? carrinho_json : carrinho_json.itens || [];
                
                // Adaptar estrutura para compatibilidade com componentes existentes
                const items = itensArray.map(item => ({
                    id: item.id,
                    nome: item.produto.nome,
                    preco: parseFloat(item.produto.preco),
                    quantidade: item.quantidade,
                    subtotal: item.subtotal,
                    produto_id: item.produto.id,
                    produto: {
                        id: item.produto.id,
                        nome: item.produto.nome,
                        imagem: item.produto.imagem
                    }
                }));
                setItensCarrinho(items);
            } catch (error) {
                console.error("Erro ao buscar carrinho:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Handlers
    const handleUpdateQuantity = (itemId, novaQuantidade) => {
        setItensCarrinho(itens =>
            itens.map(item =>
                item.id === itemId
                    ? { ...item, quantidade: novaQuantidade, subtotal: item.preco * novaQuantidade }
                    : item
            )
        );
    };

    const handleRemoveItem = async (itemId) => {
        try {
            await fetch(`${host}/api/carrinho/remover/${itemId}/`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
        setItensCarrinho(itens => itens.filter(item => item.id !== itemId));
        mostrarNotificacao("produto deletado com sucesso!", "success")

        } catch (error){
            console.log("Error on product deletion:", error)
            mostrarNotificacao("Erro ao deletar produto.", "error")
        } 
    };

    const handleCheckout = async (dadosCheckout) => {
        try{
        console.log('Finalizando compra:', dadosCheckout);
        await fetch(`${host}/api/carrinho/finalizar/`, {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });
        alert(`Compra finalizada com sucesso!`);
        } catch (error) {
            console.error("Erro ao buscar carrinho:", error);
        } 
    };

    if (redirectToLogin) {
        return <Navigate to="/Auth?sessionExpired=true" replace />;
    }

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
            <SideNavBar />
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