import React, { useState } from "react";
import logo from "../../assets/Logo.png";
import "../../styles/login.css";

function Login() {
    const [isLogin, setIsLogin] = useState(true); // Estado para alternar entre login e cadastro
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [confirmaSenha, setConfirmaSenha] = useState("");
    const [nomeCompleto, setNomeCompleto] = useState("");
    const [telefone, setTelefone] = useState("");
    const [endereco, setEndereco] = useState("");
    const [tipoConta, setTipoConta] = useState(""); // Valor inicial vazio para placeholder

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!isLogin) {
            if (senha !== confirmaSenha) {
                alert("As senhas não coincidem.");
                return;
            }
        }

        if (isLogin) {
            // Lógica de login
            console.log("Login:", { email, senha });
        } else {
            // Lógica de cadastro
            console.log("Cadastro:", { nomeCompleto, telefone, endereco, tipoConta, email, senha });
        }
    };

    return (
        <div className="auth-container">
            <img className="logo" src={logo} alt="Logo" />
            <h2>{isLogin ? "Login" : "Cadastro"}</h2>
            <form onSubmit={handleSubmit}>
                {isLogin ? (
                    <>
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
                    </>
                ) : (
                    <>
                        <input
                            type="text"
                            placeholder="Nome Completo"
                            value={nomeCompleto}
                            onChange={(e) => setNomeCompleto(e.target.value)}
                            required
                        />
                        <input
                            type="text"
                            placeholder="Telefone"
                            value={telefone}
                            onChange={(e) => setTelefone(e.target.value)}
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
                            <option value="" disabled>Escolha o tipo de conta</option>
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
            <button onClick={() => {
                setIsLogin(!isLogin);
            }}>
                {isLogin ? "Criar uma conta" : "Já tenho uma conta"}
            </button>
            {isLogin && (
                <div className="forgot-password">
                    <a href="/esqueci-senha">Esqueci a senha</a>
                </div>
            )}
            {!isLogin && (
                <a href="/politica-de-privacidade" className="privacy-link">política de privacidade</a>

            )}
        </div>
    );
}

export default Login;
