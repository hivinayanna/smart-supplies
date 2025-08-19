import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import "../../styles/historicoCompras.css";
import Notificacao from '../../components/notificacao';
import { useNotificacao } from '../../hooks/useNotificacao';

const HistoricoCompras = () => {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  //const [error, setError] = useState(null);
  const { notificacao, mostrarNotificacao, fecharNotificacao } = useNotificacao();
  const [redirectToLogin, setRedirectToLogin] = useState(false);
  const [filtro, setFiltro] = useState("todos"); // todos, mes, semana
  const host = import.meta.env.REACT_APP_HOST || "http://localhost:8000";

  const tipoUsuario = sessionStorage.getItem("tipoUsuario");
  const isVendedor = tipoUsuario === "vendedor";

  useEffect(() => {
    carregarHistorico();
  }, [filtro]);

  const carregarHistorico = async () => {
    try {
      const token = sessionStorage.getItem("accessToken");
      if (!token) {
        setRedirectToLogin(true);
        return;
      }
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

      let pedidos = await response.json();
      setPedidos(Array.isArray(pedidos) ? pedidos : []);
      console.log("Histórico carregado com sucesso!")
      setLoading(false);
    } catch (error) {
      console.error("Erro ao carregar histórico:", error);
      mostrarNotificacao("Erro ao carregar o histórico. Tente novamente mais tarde.", "error");
      setLoading(false);
    }
  };

  if (redirectToLogin) {
    return <Navigate to="/Auth?sessionExpired=true" replace />;
  }

  if (loading) {
    return <div className="historico-loading">Carregando histórico...</div>;
  }

  // if (error) {
  //   return <div className="historico-error">{error}</div>;
  // }

  return (
    <div className="historico-container">
      <h2>{isVendedor ? "Histórico de Vendas" : "Histórico de Compras"}</h2>

      <div className="filtros-container">
        <select
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          className="filtro-periodo"
        >
          <option value="todos">Todos os períodos</option>
          <option value="mes">Último mês</option>
          <option value="semana">Última semana</option>
        </select>
      </div>

      <div className="pedidos-lista">
        {pedidos.map((pedido) => (
          <div key={pedido.id} className="pedido-card">
            <div className="pedido-header">
              <h3>Pedido #{pedido.id}</h3>
              <span className={`status-tag ${(pedido.status || 'Concluído').toLowerCase().replace(' ', '-')}`}>
                {pedido.status || 'Concluído'}
              </span>
            </div>

            <div className="pedido-info">
              <p className="data">
                Data: {new Date(pedido.data).toLocaleDateString()}
              </p>
              <p className="total">Total: R$ {pedido.total.toFixed(2)}</p>
            </div>

            <div className="pedido-itens">
              <h4>Itens:</h4>
              <ul>
                {pedido.itens.map((item, index) => (
                  <li key={index}>
                    {item.quantidade}x {item.nome} - R${" "}
                    {(item.quantidade * item.preco).toFixed(2)}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}

        {pedidos.length === 0 && (
          <div className="sem-pedidos">
            <p>Nenhum pedido encontrado para o período selecionado.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoricoCompras;
