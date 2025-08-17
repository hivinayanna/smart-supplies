import React, { useState, useEffect } from 'react';
import SideNavBar from '../../components/sideNavBar';
import FavoriteCard from '../../components/favoriteCard';
import Footer from '../../components/footer';
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
    const host = import.meta.env.REACT_APP_HOST || "http://localhost:8000";

    // Simular carregamento dos favoritos
    useEffect(() => {
        const token = sessionStorage.getItem("accessToken");

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
            // {
            //     id: 1,
            //     nome: "Coca-Cola Lata 350ml",
            //     descricao: "Refrigerante de cola em lata de 350ml",
            //     preco: 3.50,
            //     quantidade_estoque: 50,
            //     imagem: "https://cdn.dooca.store/4309/products/701d27b0222a52d1980f7e84ff282b4c.jpg?v=1653064450",
            //     categoria: { nome: "Bebidas" },
            //     fornecedor: { nome: "Distribuidora ABC" }
            // },
        }
        fetchData();
    }, []);

    // Handler para remover dos favoritos
    const handleRemoveFavorite = (produtoId) => {
        setFavoritos(prev => prev.filter(produto => produto.id !== produtoId));
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
            <SideNavBar tipoUsuario="vendedor" />
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
        </>
    );
}

export default ListaDesejos;