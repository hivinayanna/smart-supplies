import React from 'react';
import { useParams } from 'react-router-dom';
import SideNavBar from '../../components/sideNavBar';
import ProdutoVisualizacao from '../../components/produtoVisualizacao';
import AvaliacaoComentario from '../../components/avaliacaoComentario';
import Notificacao from '../../components/notificacao';
import { useNotificacao } from '../../hooks/useNotificacao';
import '../../styles/produtoDetalhes.css';

const ProdutoDetalhes = () => {
    const { id } = useParams();
    const { notificacao, mostrarNotificacao, fecharNotificacao } = useNotificacao();

    return (
        <div className="produto-detalhes-container">
            <div className="main-content">
                <SideNavBar />
                <div className="produto-detalhes-content">
                    <div className="components-wrapper">
                        <ProdutoVisualizacao produtoId={id} mostrarNotificacao={mostrarNotificacao} />
                        <AvaliacaoComentario produtoId={id} />
                    </div>
                </div>
            </div>
            {notificacao && (
                <Notificacao
                    mensagem={notificacao.mensagem}
                    tipo={notificacao.tipo}
                    onClose={fecharNotificacao}
                />
            )}
        </div>
    );
};

export default ProdutoDetalhes;