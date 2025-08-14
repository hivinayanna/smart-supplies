import { useState } from 'react';

export const useNotificacao = () => {
    const [notificacao, setNotificacao] = useState(null);

    const mostrarNotificacao = (mensagem, tipo = 'info') => {
        setNotificacao({ mensagem, tipo });
    };

    const fecharNotificacao = () => {
        setNotificacao(null);
    };

    return {
        notificacao,
        mostrarNotificacao,
        fecharNotificacao
    };
};