import React, { useState, useEffect } from 'react';
import '../../styles/avaliacaoComentario.css';

const host = import.meta.env.REACT_APP_HOST || "http://localhost:8000";

const AvaliacaoComentario = ({ produtoId }) => {
    const [avaliacoes, setAvaliacoes] = useState([]);
    const [novaAvaliacao, setNovaAvaliacao] = useState({ nota: 5, comentario: '' });
    const [usuario, setUsuario] = useState(null);
    
    const avaliacoesMock = [
        {
            id: 1,
            usuario: { username: 'João Silva' },
            nota: 5,
            comentario: 'Produto excelente! Superou minhas expectativas.',
            data_criacao: '2024-01-15T10:30:00Z'
        },
        {
            id: 2,
            usuario: { username: 'Maria Santos' },
            nota: 4,
            comentario: 'Muito bom produto, entrega rápida e bem embalado.',
            data_criacao: '2024-01-10T14:20:00Z'
        },
        {
            id: 3,
            usuario: { username: 'Pedro Costa' },
            nota: 5,
            comentario: 'Recomendo! Qualidade top e preço justo.',
            data_criacao: '2024-01-08T09:15:00Z'
        }
    ];

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
                    setAvaliacoes(data.length > 0 ? data : avaliacoesMock);
                } else {
                    setAvaliacoes(avaliacoesMock);
                }
            } catch (error) {
                console.error("Erro ao buscar avaliações:", error);
                setAvaliacoes(avaliacoesMock);
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
        if (!novaAvaliacao.comentario.trim()) return;

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
                setAvaliacoes([novaAvaliacaoData, ...avaliacoes]);
            } else {
                throw new Error('Falha na API');
            }
        } catch (error) {
            console.error("Erro ao enviar avaliação:", error);
            // Fallback: adicionar aos dados mockados
            const novaAvaliacaoMock = {
                id: Date.now(),
                usuario: { username: 'Você' },
                nota: novaAvaliacao.nota,
                comentario: novaAvaliacao.comentario,
                data_criacao: new Date().toISOString()
            };
            setAvaliacoes([novaAvaliacaoMock, ...avaliacoes]);
        }
        
        setNovaAvaliacao({ nota: 5, comentario: '' });
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