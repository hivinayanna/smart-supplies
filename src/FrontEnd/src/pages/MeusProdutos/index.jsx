import React, { useState, useEffect } from 'react';
import SideNavBar from '../../components/sideNavBar';
import CadastrarItensFornecedor from '../../components/cadastrarItensFornecedor';
import ListarItensFornecedor from '../../components/listarItensFornecedor';
import Footer from '../../components/footer';
import Notificacao from '../../components/notificacao';
import { useNotificacao } from '../../hooks/useNotificacao';
import { Navigate } from "react-router-dom";
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
    const [redirectToLogin, setRedirectToLogin] = useState(false);
    const host = import.meta.env.REACT_APP_HOST || "http://localhost:8000";
    const token = sessionStorage.getItem("accessToken");

    // Simular carregamento dos produtos
    useEffect(() => {
        
        const fetchData = async () => {
        
        if (!token) {
            // Se não houver token, redireciona para a página de login
            setRedirectToLogin(true);
            return;
        }

        try {
            const response = await fetch(`${host}/api/fornecedor/produtos/`, {
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

            let produtos_vendedor = await response.json();
            
            setTimeout(() => {
                setProdutos(produtos_vendedor);
                setLoading(false);
            }, 1000);
        } catch (error) {
            console.log(error)
            mostrarNotificacao(`Erro ao buscar produtos. Tente novamente mais tarde.`, "error");
        }
        };

        fetchData();
    }, []);

    if (redirectToLogin) {
        return <Navigate to="/Auth?sessionExpired=true" replace />;
    }

    // Handler para adicionar novo produto
    const handleAddProduto = async (formDataProduto) => {
        // Simular delay da API
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Converter FormData para objeto
        const novoProduto = {
            //id: Date.now(),
            nome: formDataProduto.get('nome'),
            descricao: formDataProduto.get('descricao'),
            preco: parseFloat(formDataProduto.get('preco')),
            quantidade_estoque: parseInt(formDataProduto.get('quantidade_estoque')),
            categoria_id: formDataProduto.get('categoria'),
            imagem: formDataProduto.get('imagem') ? URL.createObjectURL(formDataProduto.get('imagem')) : null,
            //data_cadastro: new Date().toISOString()
        };
        
        setProdutos(prev => [...prev, novoProduto]);
    };

    // Handler para editar produto
    const handleEditProduto = async (produtoAtualizado) => {
        try {
            await fetch(`${host}/api/produtos/${produtoAtualizado.id}/`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ produtoAtualizado })
            });
            setProdutos(prev => 
                prev.map(produto => 
                    produto.id === produtoAtualizado.id ? produtoAtualizado : produto
                )
            );
            mostrarNotificacao('Produto atualizado com sucesso!', 'success');
        } catch (error){
            console.log("Error on product deletion:", error)
            mostrarNotificacao("Erro ao deletar produto.", "error")
        }
    };

    // Handler para deletar produto
    const handleDeleteProduto = async (produtoId) => {
        try {
            await fetch(`${host}/api/produtos/${produtoId}/`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
        setProdutos(prev => prev.filter(produto => produto.id !== produtoId));
        mostrarNotificacao("produto deletado com sucesso!", "success")

        } catch (error){
            console.log("Error on product deletion:", error)
            mostrarNotificacao("Erro ao deletar produto.", "error")
        }
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