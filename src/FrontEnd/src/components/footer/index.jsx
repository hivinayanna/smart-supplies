// Footer.js
import React from 'react';
import '../../styles/footer.css';

function Footer() {
    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="footer-column">
                    <h4>Privacidade</h4>
                    <ul>
                        <li><a href="#termos">Termos de Uso</a></li>
                        <li><a href="#politica">Política de Privacidade</a></li>
                        <li><a href="#cookies">Cookies</a></li>
                    </ul>
                </div>

                <div className="footer-column">
                    <h4>Serviços</h4>
                    <ul>
                        <li><a href="#produtos">Produtos</a></li>
                        <li><a href="#fornecedores">Fornecedores</a></li>
                    </ul>
                </div>

                <div className="footer-column">
                    <h4>Fale Conosco</h4>
                    <ul>
                        <li><a>+55 88 99999-9999</a> </li>
                        <li><a href="mailto:contato@exemplo.com">Email: contato@exemplo.com</a></li>
                    </ul>
                </div>

                <div className="footer-column">
                    <h4>Siga-nos</h4>
                    <ul className="social-links">
                        <li><a href="https://facebook.com" target="_blank" rel="noopener noreferrer">Facebook</a></li>
                        <li><a href="https://instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a></li>
                        <li><a href="https://x.com" target="_blank" rel="noopener noreferrer">X</a></li>
                    </ul>
                </div>
            </div>
            <div className="footer-line"></div>
            <div className="footer-bottom">
                <p>© 2025 Smart Supplies. Todos os direitos reservados.</p>
            </div>
        </footer>
    );
}

export default Footer;