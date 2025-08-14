import React, { useState, useEffect } from "react";
import logo from "../../assets/Logo.png";
import "../../styles/login.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { validarCampo, mensagensErro, aplicarMascara } from "../../utils/validacao";

function Login({ mostrarNotificacao }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmaSenha, setConfirmaSenha] = useState("");
  const [nomeCompleto, setNomeCompleto] = useState("");
  const [telefone, setTelefone] = useState("");
  const [endereco, setEndereco] = useState("");
  const [tipoConta, setTipoConta] = useState("");
  const [username, setUsername] = useState(""); // ⬅️ Novo campo
  const [sessionExpired, setSessionExpired] = useState(false); // Verifica se a sessão expirou

  const redirect = useNavigate();
  // TODO: retirar valor default depois
  const host = import.meta.env.REACT_APP_HOST || "http://localhost:8000";

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    if (queryParams.get("sessionExpired")) {
      setSessionExpired(true);
    }
  }, [location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isLogin) {
      // Validações para cadastro
      if (!validarCampo('username', username)) {
        mostrarNotificacao(mensagensErro.username, "error");
        return;
      }
      if (!validarCampo('nomeCompleto', nomeCompleto)) {
        mostrarNotificacao(mensagensErro.nomeCompleto, "error");
        return;
      }
      if (!validarCampo('email', email)) {
        mostrarNotificacao(mensagensErro.email, "error");
        return;
      }
      if (!validarCampo('senha', senha)) {
        mostrarNotificacao(mensagensErro.senha, "error");
        return;
      }
      if (senha !== confirmaSenha) {
        mostrarNotificacao("As senhas não coincidem.", "error");
        return;
      }
    }

    const register_data = {
      username: username, // ⬅️ Agora usando o valor correto
      nome_completo: nomeCompleto,
      telefone: telefone,
      endereco: endereco,
      tipo_conta: tipoConta,
      email: email,
      password: senha,
    };

    const login_data = {
      username: username, // ⬅️ Alterado para usar o username digitado
      password: senha,
    };

    try {
      let response;
      if (isLogin) {
        response = await axios.post(`${host}/api/token/`, login_data);
        console.log("Login:", login_data);
        console.log("Resposta: ", response);
        mostrarNotificacao("Usuário logado com sucesso!", "success");

        if (response.data.access) {
          console.log(`token: ${response.data.access}`);
          sessionStorage.setItem("tipoUsuario", response.data.tipo_usuario);
          sessionStorage.setItem("accessToken", response.data.access);
          redirect(`/start`);
        }
        console.log(response.status);
        if (response.status == 401) {
          redirect(`/login`);
        }
      } else {
        response = await axios.post(
          `${host}/api/usuarios/novo/`,
          register_data
        );
        console.log("Cadastro:", register_data);
        console.log("Resposta: ", response);
        mostrarNotificacao("Cadastro realizado com sucesso!", "success");
        // Limpar campos e ir para login
        setUsername("");
        setNomeCompleto("");
        setTelefone("");
        setEndereco("");
        setTipoConta("");
        setEmail("");
        setSenha("");
        setConfirmaSenha("");
        setIsLogin(true);
      }
    } catch (error) {
      console.error("Erro:", error);
      mostrarNotificacao("Erro ao processar. Verifique os dados e tente novamente.", "error");
    }
  };

  return (
    <div className="auth-container">
      {sessionExpired && (
        // TODO: alterar para um container no canto superior da tela (não quero quebrar o css)
        <div className="session-expired-message">
          Sua sessão foi finalizada. Por favor, faça login novamente.
        </div>
      )}
      <img className="logo" src={logo} alt="Logo" />
      <h2>{isLogin ? "Login" : "Cadastro"}</h2>
      <form onSubmit={handleSubmit}>
        {isLogin ? (
          <>
            <input
              type="text"
              placeholder="Usuário"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
            />
          </>
        ) : (
          <>
            <input
              type="text"
              placeholder="Usuário"
              value={username}
              onChange={(e) => setUsername(aplicarMascara('username', e.target.value))}
              required
            />
            <input
              type="text"
              placeholder="Nome Completo"
              value={nomeCompleto}
              onChange={(e) => setNomeCompleto(aplicarMascara('nomeCompleto', e.target.value))}
              required
            />
            <input
              type="text"
              placeholder="Telefone"
              value={telefone}
              onChange={(e) => setTelefone(aplicarMascara('telefone', e.target.value))}
              required
            />
            <input
              type="text"
              placeholder="Endereço"
              value={endereco}
              onChange={(e) => setEndereco(e.target.value)}
              required
            />
            <select
              className="select-input"
              value={tipoConta}
              onChange={(e) => setTipoConta(e.target.value)}
              required
            >
              <option value="" disabled>
                Escolha o tipo de conta
              </option>
              <option value="vendedor">Vendedor</option>
              <option value="comprador">Comprador</option>
            </select>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Confirmar Senha"
              value={confirmaSenha}
              onChange={(e) => setConfirmaSenha(e.target.value)}
              required
            />
          </>
        )}
        <button type="submit">{isLogin ? "Entrar" : "Cadastrar"}</button>
      </form>
      <button onClick={() => setIsLogin(!isLogin)}>
        {isLogin ? "Criar uma conta" : "Já tenho uma conta"}
      </button>
      {isLogin && (
        <div className="forgot-password">
          <a>Esqueci a senha</a>
        </div>
      )}
      {!isLogin && (
        <div className="privacy-link">
          <a href="/politica-de-privacidade">política de privacidade</a>
        </div>
      )}
    </div>
  );
}

export default Login;
