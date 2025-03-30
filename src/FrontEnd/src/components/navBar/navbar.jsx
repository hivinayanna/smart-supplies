import React from "react";
import './navbar.css';
import logo from '../../assets/Logo.png';
import { Link } from "react-router-dom";

export class NavBar extends React.Component {
    render() {
        return (
            <>
                <nav className="navbar">
                    <ul className="nav-links">

                        <div className="menu">
                            <Link to="/"><li>INÍCIO</li></Link><h4>•</h4>

                            <Link to="#"><li>CATEGORIAS DE BEBIDAS</li></Link>

                            <li><img className="logo" src={logo} /></li>

                            <Link to="#"><li>FORNECEDORES</li></Link><h4>•</h4>

                            <Link to="#"><li>PRODUTOS</li></Link>

                            <Link to="#">
                                <li className="Login">
                                    <span className="material-symbols-outlined">login</span>
                                    Login
                                </li>
                            </Link>
                        </div>
                    </ul>
                </nav>
            </>
        );
    }
}


