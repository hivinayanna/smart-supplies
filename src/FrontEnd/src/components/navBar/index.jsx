import React from "react";
import "../../styles/navbar.css";
import logo from "../../assets/Logo.png";
import { Link } from "react-router-dom";

export class NavBar extends React.Component {
  render() {
    return (
      <>
        <nav className="navbar">
          <div className="nav-links">
            <ul className="menu">
              <Link to="/login">
                <li>INÍCIO</li>
              </Link>
              <h4>•</h4>

              <Link to="/login">
                <li>CATEGORIAS DE BEBIDAS</li>
              </Link>

              <li>
                <img className="logo" src={logo} />
              </li>

              <Link to="/login">
                <li>FORNECEDORES</li>
              </Link>
              <h4>•</h4>

              <Link to="/login">
                <li>PRODUTOS</li>
              </Link>
            </ul>

            <Link to="/login">
              <button className="Login">
                <span className="material-symbols-outlined">login</span>
                Entre/Cadastre-se
              </button>
            </Link>
          </div>
        </nav>
      </>
    );
  }
}
