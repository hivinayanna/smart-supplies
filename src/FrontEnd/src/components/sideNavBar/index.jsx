import React from "react";
import "../../styles/sideNavBar.css";
import logo from "../../assets/Logo.png";
import { Link } from "react-router-dom";

function SideNavBar() {
  const tipoUsuario = sessionStorage.getItem("tipoUsuario")
  const isVendedor = tipoUsuario === "vendedor";

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <img className="logoStartPage" src={logo} alt="Logo" />
        <h2>Smart Suplies</h2>
      </div>

      <ul className="sidebar-links">
        <h4>
          <span>Menu Principal</span>
          <div className="menu-separator"></div>
        </h4>

        <li>
          <Link to="/Start">
            <span className="material-symbols-outlined">home</span>Home
          </Link>
        </li>
        <li>
          <Link to="/carrinho">
            <span className="material-symbols-outlined">shopping_cart</span>
            Carrinho
          </Link>
        </li>
        <li>
          <Link to="/fornecedores">
            <span className="material-symbols-outlined">groups</span>
            Fornecedores
          </Link>
        </li>
        <li>
          <Link to="/lista-desejos">
            <span className="material-symbols-outlined">favorite</span>
            Lista de Desejos
          </Link>
        </li>
        <li>
          <Link to="/historico">
            <span className="material-symbols-outlined">history</span>
            {isVendedor ? "Histórico de Vendas" : "Histórico de Compras"}
          </Link>
        </li>
        <li>
          <Link to="/">
            <span className="material-symbols-outlined">manage_accounts</span>
            Configurações
          </Link>
        </li>

        {/* 🔽 Opções extras apenas para Vendedor */}
        {isVendedor && (
          <>
            <li>
              <Link to="/meus-produtos">
                <span className="material-symbols-outlined">inventory_2</span>
                Meus Produtos
              </Link>
            </li>
            <li>
              <Link to="/">
                <span className="material-symbols-outlined">trending_up</span>
                Insights de Vendas
              </Link>
            </li>
            <li>
              <Link to="/">
                <span className="material-symbols-outlined">star_rate</span>
                Avaliações
              </Link>
            </li>
          </>
        )}

        <li>
          <Link to="/">
            <span className="material-symbols-outlined">logout</span>
            Sair
          </Link>
        </li>
      </ul>
    </aside>
  );
}

export default SideNavBar;
