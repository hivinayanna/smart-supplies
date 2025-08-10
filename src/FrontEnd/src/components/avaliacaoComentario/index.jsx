import React, { useState, useEffect } from 'react';
import '../../styles/avaliacaoComentario.css';

const host = import.meta.env.REACT_APP_HOST || "http://localhost:8000";

const AvaliacaoComentario = ({ produtoId }) => {
    const [avaliacoes, setAvaliacoes] = useState([]);
    const [novaAvaliacao, setNovaAvaliacao] = useState({ nota: 5, comentario: '' });
    const [usuario, setUsuario] = useState(null);

    useEffect(() => {
        const fetchAvaliacoes = async () => {
            const token = sessionStorage.getItem("accessToken");
            if (!token) return;

            try {
                const response = await fetch(`${host}/api/avaliacoes/?produto=${produtoId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });
                
                if (response.ok) {
                    const data = await response.json();
                    setAvaliacoes(data);
                }
            } catch (error) {
                console.error("Erro ao buscar avaliações:", error);
            }
        };

        const fetchUsuario = async () => {
            const token = sessionStorage.getItem("accessToken");
            if (!token) return;

            try {
                const response = await fetch(`${host}/api/user/`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });
                
                if (response.ok) {
                    const userData = await response.json();
                    setUsuario(userData);
                }
            } catch (error) {
                console.error("Erro ao buscar usuário:", error);
            }
        };

        fetchAvaliacoes();
        fetchUsuario();
    }, [produtoId]);

    const enviarAvaliacao = async () => {
        const token = sessionStorage.getItem("accessToken");
        if (!token || !novaAvaliacao.comentario.trim()) return;

        try {
            const response = await fetch(`${host}/api/avaliacoes/`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    produto: produtoId,
                    nota: novaAvaliacao.nota,
                    comentario: novaAvaliacao.comentario,
                }),
            });

            if (response.ok) {
                const novaAvaliacaoData = await response.json();
                setAvaliacoes([...avaliacoes, novaAvaliacaoData]);
                setNovaAvaliacao({ nota: 5, comentario: '' });
            }
        } catch (error) {
            console.error("Erro ao enviar avaliação:", error);
        }
    };

    const renderEstrelas = (nota, isInteractive = false) => {
        return Array.from({ length: 5 }, (_, i) => (
            <span
                key={i}
                className={`estrela ${i < nota ? 'ativa' : ''} ${isInteractive ? 'interativa' : ''}`}
                onClick={isInteractive ? () => setNovaAvaliacao({...novaAvaliacao, nota: i + 1}) : undefined}
            >
                ★
            </span>
        ));
    };

    return (
        <div className="avaliacao-comentario">
            <h3>Avaliações</h3>
            
            <div className="nova-avaliacao">
                <h4>Deixe sua avaliação</h4>
                <div className="estrelas-input">
                    {renderEstrelas(novaAvaliacao.nota, true)}
                </div>
                <textarea
                    value={novaAvaliacao.comentario}
                    onChange={(e) => setNovaAvaliacao({...novaAvaliacao, comentario: e.target.value})}
                    placeholder="Escreva seu comentário..."
                    rows="4"
                />
                <button onClick={enviarAvaliacao} className="btn-enviar">
                    Enviar Avaliação
                </button>
            </div>

            <div className="avaliacoes-lista">
                {avaliacoes.map((avaliacao, index) => (
                    <div key={index} className="avaliacao-item">
                        <div className="avaliacao-header">
                            <strong>{avaliacao.usuario?.username || 'Usuário'}</strong>
                            <div className="estrelas">
                                {renderEstrelas(avaliacao.nota)}
                            </div>
                        </div>
                        <p>{avaliacao.comentario}</p>
                        <small>{new Date(avaliacao.data_criacao).toLocaleDateString()}</small>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AvaliacaoComentario;