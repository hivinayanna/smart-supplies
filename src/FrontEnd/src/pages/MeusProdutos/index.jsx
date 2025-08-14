import React, { useState, useEffect } from 'react';
import SideNavBar from '../../components/sideNavBar';
import CadastrarItensFornecedor from '../../components/cadastrarItensFornecedor';
import ListarItensFornecedor from '../../components/listarItensFornecedor';
import Footer from '../../components/footer';
import Notificacao from '../../components/notificacao';
import { useNotificacao } from '../../hooks/useNotificacao';
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
    const { notificacao, mostrarNotificacao, fecharNotificacao } = useNotificacao();

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
                imagem: "https://res.cloudinary.com/dj5eeszbx/image/upload/v1755180798/sem_imagem_o3vo3n.png",
                data_cadastro: "2024-01-15T10:30:00Z"
            },
            {
                id: 2,
                nome: "Água Mineral 500ml",
                descricao: "Água mineral natural sem gás",
                preco: 2.00,
                quantidade_estoque: 200,
                categoria: "bebidas",
                imagem: "https://res.cloudinary.com/dj5eeszbx/image/upload/v1755180798/sem_imagem_o3vo3n.png",
                data_cadastro: "2024-01-14T14:20:00Z"
            }
        ];

        setTimeout(() => {
            setProdutos(mockProdutos);
            setLoading(false);
        }, 1000);
    }, []);

    // Handler para adicionar novo produto
    const handleAddProduto = async (formDataProduto) => {
        // Simular delay da API
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Converter FormData para objeto
        const novoProduto = {
            id: Date.now(),
            nome: formDataProduto.get('nome'),
            descricao: formDataProduto.get('descricao'),
            preco: parseFloat(formDataProduto.get('preco')),
            quantidade_estoque: parseInt(formDataProduto.get('quantidade_estoque')),
            categoria: formDataProduto.get('categoria'),
            imagem: formDataProduto.get('imagem') ? URL.createObjectURL(formDataProduto.get('imagem')) : null,
            data_cadastro: new Date().toISOString()
        };
        
        setProdutos(prev => [...prev, novoProduto]);
    };

    // Handler para editar produto
    const handleEditProduto = (produtoAtualizado) => {
        setProdutos(prev => 
            prev.map(produto => 
                produto.id === produtoAtualizado.id ? produtoAtualizado : produto
            )
        );
        mostrarNotificacao('Produto atualizado com sucesso!', 'success');
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
                            <CadastrarItensFornecedor onAddProduto={handleAddProduto} mostrarNotificacao={mostrarNotificacao} />
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
            {notificacao && (
                <Notificacao
                    mensagem={notificacao.mensagem}
                    tipo={notificacao.tipo}
                    onClose={fecharNotificacao}
                />
            )}
            <Footer />
        </>
    );
}

export default MeusProdutos;