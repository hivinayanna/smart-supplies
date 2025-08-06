import React, { useState, useEffect } from 'react';
import SideNavBar from '../../components/sideNavBar';
import FavoriteCard from '../../components/favoriteCard';
import Footer from '../../components/footer';
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

    // Simular carregamento dos favoritos
    useEffect(() => {
        // Mock data - substituir por chamada à API
        const mockFavoritos = [
            {
                id: 1,
                nome: "Coca-Cola Lata 350ml",
                descricao: "Refrigerante de cola em lata de 350ml",
                preco: 3.50,
                quantidade_estoque: 50,
                imagem: "https://cdn.dooca.store/4309/products/701d27b0222a52d1980f7e84ff282b4c.jpg?v=1653064450",
                categoria: { nome: "Bebidas" },
                fornecedor: { nome: "Distribuidora ABC" }
            },
            {
                id: 2,
                nome: "Água Mineral 500ml",
                descricao: "Água mineral natural sem gás",
                preco: 2.00,
                quantidade_estoque: 100,
                imagem: "https://cdn.dooca.store/4309/products/701d27b0222a52d1980f7e84ff282b4c.jpg?v=1653064450",
                categoria: { nome: "Bebidas" },
                fornecedor: { nome: "Águas do Brasil" }
            },
            {
                id: 3,
                nome: "Suco de Laranja 1L",
                descricao: "Suco natural de laranja integral",
                preco: 8.50,
                quantidade_estoque: 30,
                imagem: "https://cdn.dooca.store/4309/products/701d27b0222a52d1980f7e84ff282b4c.jpg?v=1653064450",
                categoria: { nome: "Bebidas" },
                fornecedor: { nome: "Sucos Naturais Ltda" }
            }
        ];

        setTimeout(() => {
            setFavoritos(mockFavoritos);
            setLoading(false);
        }, 1000);
    }, []);

    // Handler para remover dos favoritos
    const handleRemoveFavorite = (produtoId) => {
        setFavoritos(prev => prev.filter(produto => produto.id !== produtoId));
    };

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