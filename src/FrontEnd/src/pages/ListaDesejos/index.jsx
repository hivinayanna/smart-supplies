import React, { useState, useEffect } from 'react';
import SideNavBar from '../../components/sideNavBar';
import FavoriteCard from '../../components/favoriteCard';
import Footer from '../../components/footer';
import Notificacao from '../../components/notificacao';
import { useNotificacao } from '../../hooks/useNotificacao';
import { Navigate } from "react-router-dom";
import '../../styles/listaDesejos.css';

/**
 * Página ListaDesejos - Página da lista de desejos do usuário
 * 
 * Exibe todos os produtos favoritados pelo usuário e permite
 * remover itens da lista de desejos.
 * 
 * @returns {JSX.Element} Elemento JSX da página de lista de desejos
 */
function ListaDesejos() {
    const [favoritos, setFavoritos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [redirectToLogin, setRedirectToLogin] = useState(false);
    const { notificacao, mostrarNotificacao, fecharNotificacao } = useNotificacao();
    const host = import.meta.env.REACT_APP_HOST || "http://localhost:8000";
    const token = sessionStorage.getItem("accessToken");
    // Simular carregamento dos favoritos
    useEffect(() => {

        const fetchData = async () => {
            if (!token) {
                // Se não houver token, redireciona para a página de login
                setRedirectToLogin(true);
                return;
            }
            try {
                const response = await fetch(`${host}/api/lista-desejos/`, {

                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                if (response.status === 401) {
                    console.log("Unauthorized login");
                    setRedirectToLogin(true);
                    return;
                }
                let favoritos_json = await response.json();
                setTimeout(() => {
                    setFavoritos(favoritos_json);
                    setLoading(false);
                }, 1000);
            } catch (error) {
                console.error("Erro ao buscar produtos:", error);
            }
        }
        fetchData();
    }, []);

    // Handler para remover dos favoritos
    const handleRemoveFavorite = async (produtoId) => {
        try {
            await fetch(`${host}/api/lista-desejos/${produtoId}/`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            setFavoritos(prev => prev.filter(item => item.produto.id !== produtoId));
            mostrarNotificacao("Produto removido da lista de desejos!", "success");
        } catch (error) {
            console.log("Error on product deletion:", error);
            mostrarNotificacao("Erro ao remover produto.", "error");
        } 
    };

    if (redirectToLogin) {
        return <Navigate to="/Auth?sessionExpired=true" replace />;
    }

    if (loading) {
        return (
            <div className="lista-desejos-loading">
                <div className="loading-content">
                    <p>Carregando lista de desejos...</p>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <>
            <SideNavBar />
            <div className="lista-desejos-layout">
                <main className="lista-desejos-main">
                    <div className="lista-desejos-header">
                        <h1>Lista de Desejos</h1>
                        <span className="favoritos-count">
                            {favoritos.length} {favoritos.length === 1 ? 'item' : 'itens'}
                        </span>
                    </div>

                    {favoritos.length === 0 ? (
                        <div className="lista-vazia">
                            <div className="empty-heart">💔</div>
                            <h2>Sua lista de desejos está vazia</h2>
                            <p>Adicione produtos aos favoritos para vê-los aqui</p>
                            <button className="btn-continuar-navegando">
                                Continuar Navegando
                            </button>
                        </div>
                    ) : (
                        <div className="favoritos-grid">
                            {favoritos.map(produto => (
                                <FavoriteCard
                                    key={produto.id}
                                    produto={produto}
                                    onRemoveFavorite={handleRemoveFavorite}
                                />
                            ))}
                        </div>
                    )}
                </main>
            </div>
            <Footer />
            {notificacao && (
                <Notificacao
                    mensagem={notificacao.mensagem}
                    tipo={notificacao.tipo}
                    onClose={fecharNotificacao}
                />
            )}
        </>
    );
}

export default ListaDesejos;