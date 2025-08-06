import React, { useState, useEffect } from 'react';
import SideNavBar from '../../components/sideNavBar';
import CadastrarItensFornecedor from '../../components/cadastrarItensFornecedor';
import ListarItensFornecedor from '../../components/listarItensFornecedor';
import Footer from '../../components/footer';
import '../../styles/meusProdutos.css';

/**
 * Página MeusProdutos - Página para gerenciar produtos do fornecedor
 * 
 * Permite cadastrar novos produtos e listar/editar produtos existentes.
 * 
 * @returns {JSX.Element} Elemento JSX da página de produtos
 */
function MeusProdutos() {
    const [produtos, setProdutos] = useState([]);
    const [loading, setLoading] = useState(true);

    // Simular carregamento dos produtos
    useEffect(() => {
        // Mock data - substituir por chamada à API
        const mockProdutos = [
            {
                id: 1,
                nome: "Coca-Cola Lata 350ml",
                descricao: "Refrigerante de cola em lata de 350ml",
                preco: 3.50,
                quantidade_estoque: 100,
                categoria: "bebidas",
                imagem: "https://cdn.dooca.store/4309/products/701d27b0222a52d1980f7e84ff282b4c.jpg?v=1653064450",
                data_cadastro: "2024-01-15T10:30:00Z"
            },
            {
                id: 2,
                nome: "Água Mineral 500ml",
                descricao: "Água mineral natural sem gás",
                preco: 2.00,
                quantidade_estoque: 200,
                categoria: "bebidas",
                imagem: "https://cdn.dooca.store/4309/products/701d27b0222a52d1980f7e84ff282b4c.jpg?v=1653064450",
                data_cadastro: "2024-01-14T14:20:00Z"
            }
        ];

        setTimeout(() => {
            setProdutos(mockProdutos);
            setLoading(false);
        }, 1000);
    }, []);

    // Handler para adicionar novo produto
    const handleAddProduto = async (novoProduto) => {
        // Simular delay da API
        await new Promise(resolve => setTimeout(resolve, 500));
        
        setProdutos(prev => [...prev, novoProduto]);
    };

    // Handler para editar produto
    const handleEditProduto = (produtoAtualizado) => {
        setProdutos(prev => 
            prev.map(produto => 
                produto.id === produtoAtualizado.id ? produtoAtualizado : produto
            )
        );
        alert('Produto atualizado com sucesso!');
    };

    // Handler para deletar produto
    const handleDeleteProduto = (produtoId) => {
        setProdutos(prev => prev.filter(produto => produto.id !== produtoId));
    };

    if (loading) {
        return (
            <div className="meus-produtos-loading">
                <SideNavBar tipoUsuario="vendedor" />
                <div className="loading-content">
                    <p>Carregando produtos...</p>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <>
            <SideNavBar tipoUsuario="vendedor" />
            <div className="meus-produtos-layout">
                <main className="meus-produtos-main">
                    <div className="meus-produtos-header">
                        <h1>Meus Produtos</h1>
                        <p>Gerencie seu catálogo de produtos</p>
                    </div>

                    <div className="meus-produtos-content">
                        <div className="cadastro-section">
                            <CadastrarItensFornecedor onAddProduto={handleAddProduto} />
                        </div>

                        <div className="lista-section">
                            <ListarItensFornecedor
                                produtos={produtos}
                                onEditProduto={handleEditProduto}
                                onDeleteProduto={handleDeleteProduto}
                            />
                        </div>
                    </div>
                </main>
            </div>
            <Footer />
        </>
    );
}

export default MeusProdutos;