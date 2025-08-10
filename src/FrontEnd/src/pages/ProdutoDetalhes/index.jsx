import React from 'react';
import { useParams } from 'react-router-dom';
import SideNavBar from '../../components/sideNavBar';
import ProdutoVisualizacao from '../../components/produtoVisualizacao';
import AvaliacaoComentario from '../../components/avaliacaoComentario';
import '../../styles/produtoDetalhes.css';

const ProdutoDetalhes = () => {
    const { id } = useParams();

    return (
        <div className="produto-detalhes-container">
            <div className="main-content">
                <SideNavBar />
                <div className="produto-detalhes-content">
                    <div className="components-wrapper">
                        <ProdutoVisualizacao produtoId={id} />
                        <AvaliacaoComentario produtoId={id} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProdutoDetalhes;