import React from "react";
import Login from "../../components/login";
import Notificacao from "../../components/notificacao";
import { useNotificacao } from "../../hooks/useNotificacao";

function Auth() {
  const { notificacao, mostrarNotificacao, fecharNotificacao } = useNotificacao();
  
  return (
    <>
      <div className="login-wrapper">
        <Login mostrarNotificacao={mostrarNotificacao} />
      </div>
      {notificacao && (
        <Notificacao
          mensagem={notificacao.mensagem}
          tipo={notificacao.tipo}
          onClose={fecharNotificacao}
        />
      )}
    </>
  );
}

export default Auth;
