import React from "react";
import "../../styles/footer.css";
import logoSmartSupplies from "../../assets/Logo.png";
import facebookIcon from "../../assets/facebook.svg";
import instagramIcon from "../../assets/instagram.svg";
import twitterIcon from "../../assets/twitter.svg";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-conteudo">
        <div className="footer-logo">
          <img src={logoSmartSupplies} alt="Smart Supplies Logo" />
        </div>

        <div className="footer-links">
          <div className="footer-section">
            <h3>Privacidade</h3>
            <ul>
              <li>
                <a href="#">Termos de uso</a>
              </li>
              <li>
                <a href="#">Política de Privacidade</a>
              </li>
              <li>
                <a href="#">Cookies</a>
              </li>
            </ul>
          </div>

          <div className="footer-section">
            <h3>Serviços</h3>
            <ul>
              <li>
                <a href="#">Produtos</a>
              </li>
              <li>
                <a href="#">Fornecedores</a>
              </li>
            </ul>
          </div>

          <div className="footer-section">
            <h3>Fale Conosco</h3>
            <ul>
              <li>
                <a href="tel:+55889999999999">+55 88 99999-9999</a>
              </li>
              <li>
                <a href="mailto:smartsupplies@gmail.com">
                  smartsupplies@gmail.com
                </a>
              </li>
            </ul>
          </div>

          <div className="footer-section">
            <h3>Siga-nos!</h3>
            <div className="social-icons">
              <a href="#" aria-label="Facebook">
                <img src={facebookIcon} alt="Facebook" />
              </a>
              <a href="#" aria-label="Instagram">
                <img src={instagramIcon} alt="Instagram" />
              </a>
              <a href="#" aria-label="Twitter">
                <img src={twitterIcon} alt="Twitter" />
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2025 Smart Supplies. Todos os direitos reservados.</p>
      </div>
    </footer>
  );
};

export default Footer;
