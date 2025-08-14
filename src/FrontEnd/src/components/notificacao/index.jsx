import React, { useState, useEffect } from 'react';
import '../../styles/notificacao.css';

const Notificacao = ({ mensagem, tipo = 'info', onClose }) => {
    const [visivel, setVisivel] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setVisivel(false);
            setTimeout(() => onClose && onClose(), 300);
        }, 3000);

        return () => clearTimeout(timer);
    }, [onClose]);

    if (!visivel) return null;

    return (
        <div className={`notificacao ${tipo} ${visivel ? 'show' : ''}`}>
            <span>{mensagem}</span>
        </div>
    );
};

export default Notificacao;