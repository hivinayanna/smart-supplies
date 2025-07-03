import React from "react";
import { Link } from "react-router-dom";
import "../../styles/heroSection.css";
import cocaColaImage from "../../assets/cocaCola.svg";
import rectangleImage from "../../assets/rectangle.svg";
// container-beneficios
import fardosImage from "../../assets/fardos.svg";
import apertoDeMaoImage from "../../assets/aperto-de-mao.svg";
import caixaAbertaImage from "../../assets/caixa-aberta.svg";
import usdImage from "../../assets/circulo-usd.svg";
import fogueteImage from "../../assets/foguete.svg";
// categoria-de-bebidas
import setaCurva from "../../assets/seta-curva.svg";
import refrigerantes from "../../assets/refrigerantes.svg";
import cervejas from "../../assets/cervejas.svg";
import aguas from "../../assets/aguas.svg";
import energeticos from "../../assets/energeticos.svg";
import sucos from "../../assets/sucos.svg";
import vinhos from "../../assets/vinhos.svg";
// parceiros
import vanessaMartins from "../../assets/vanessa-martins.svg";
import felipeSouza from "../../assets/felipe-souza.svg";
import marianaNunes from "../../assets/mariana-nunes.svg";
import beatrizFreitas from "../../assets/beatriz-freitas.svg";

const HeroSection = () => {
  return (
    <section className="hero-total">
      <div className="hero">
        <div className="hero-content">
          <h1>Smart Supplies</h1>
          <p>Conectamos você aos melhores fornecedores</p>
          <p>
            Conectamos você aos fornecedores certos para abastecer seu negócio,
            com diversidade, qualidade e condições que cabem no seu orçamento.
            Simplifique sua gestão e aumente suas vendas.
          </p>
          <div className="hero-buttons">
            <button className="primary-btn">Encontre seu fornecedor</button>
            <button className="secondary-btn">Seja um fornecedor</button>
          </div>
        </div>
        <div className="hero-image">
          <img
            className="rectangle"
            src={rectangleImage}
            alt="Background Shape"
          />
          <img
            className="product"
            src={cocaColaImage}
            alt="Coca-Cola Mini Bottles"
          />
        </div>
      </div>

      <section className="container-beneficios">
        <img src={fardosImage} alt="Deposito de fardos" className="fardos" />

        <section className="beneficios-intro">
          <div className="beneficios">
            <h2
              style={{
                fontWeight: 700,
                fontSize: "40px",
                whiteSpace: "nowrap",
                paddingBottom: "14px",
                textAlign: "start",
                marginLeft: "13px",
              }}
            >
              <span style={{ color: "#334B6F" }}>Facilidade,</span>{" "}
              <span style={{ color: "#3A597A" }}>qualidade e</span>{" "}
              <span style={{ color: "#2C3F58" }}>preço justo.</span>
            </h2>
            <p>
              Aqui, você encontra os melhores fornecedores e os preços mais
              justos, sem complicação. Seja para abastecer seu negócio ou
              expandir suas vendas, oferecemos um ambiente confiável e prático
              para comprar e vender bebidas.
            </p>
          </div>

          <section className="tipos-beneficios">
            <div className="beneficio-1">
              <div className="elipse">
                <img src={caixaAbertaImage} alt="Caixa aberta" />
              </div>
              <div className="texto-beneficio">
                <h3>Grande variedade de fardos</h3>
                <p>
                  Diversas opções para atender a diferentes necessidades,
                  garantindo o que você procura.
                </p>
              </div>
            </div>

            <div className="beneficio-2">
              <div className="elipse">
                <img src={usdImage} alt="Simbolo de dinheiro" />
              </div>
              <div className="texto-beneficio">
                <h3>Preços competitivos direto dos fornecedores</h3>
                <p>
                  Preços vantajosos com acesso direto aos fornecedores, sem
                  intermediários.
                </p>
              </div>
            </div>

            <div className="beneficio-3">
              <div className="elipse">
                <img src={fogueteImage} alt="Foguete" />
              </div>
              <div className="texto-beneficio">
                <h3>Compra rápida e sem burocracia</h3>
                <p>Compras simples e ágeis, sem processos complicados.</p>
              </div>
            </div>

            <div className="beneficio-4">
              <div className="elipse">
                <img src={apertoDeMaoImage} alt="Caixa aberta" />
              </div>
              <div className="texto-beneficio">
                <h3 style={{ paddingTop: "25px" }}>
                  Conexão direta entre vendedores e revendedores
                </h3>
                <p>
                  Comunicação fácil e eficiente para negociações rápidas e sem
                  barreiras.
                </p>
              </div>
            </div>
          </section>
        </section>
      </section>

      <section className="categoria-de-bebidas">
        <div className="info-da-secao">
          <div className="titulo">
            <span
              style={{
                color: "#2B4A6B",
                fontWeight: "bold",
                fontSize: "40px",
              }}
            >
              Categoria de{" "}
            </span>
            <span
              style={{
                color: "#728BA6",
                fontWeight: "bold",
                fontSize: "40px",
              }}
            >
              bebibas
            </span>
          </div>
          <img
            style={{
              width: "230px",
            }}
            src={setaCurva}
            alt="Seta curva"
          />
          <p
            style={{
              color: "#92949F",
              fontSize: "28px",
            }}
          >
            Explore a nossa variedade de bebidas! Escolha entre refrigerantes,
            sucos, águas e muito mais.
          </p>
        </div>

        <section className="cards-categorias">
          <div className="card-categoria">
            <div className="card-content">
              <h3>Refrigerantes</h3>
              <a href="#" className="saiba-mais">
                SAIBA MAIS
              </a>
            </div>
            <img
              style={{ top: "-1px", scale: "1.4" }}
              src={refrigerantes}
              alt="Refrigerantes"
            />
          </div>
          <div className="card-categoria">
            <div className="card-conteudo">
              <h3>Cervejas</h3>
              <a href="#" className="saiba-mais">
                SAIBA MAIS
              </a>
            </div>
            <img
              style={{ top: "-50px", scale: "1" }}
              src={cervejas}
              alt="Cervejas"
            />
          </div>
          <div className="card-categoria">
            <div className="card-content">
              <h3>Águas</h3>
              <a href="#" className="saiba-mais">
                SAIBA MAIS
              </a>
            </div>
            <img src={aguas} alt="Águas" />
          </div>
          <div className="card-categoria">
            <div className="card-content">
              <h3>Energéticos</h3>
              <a href="#" className="saiba-mais">
                SAIBA MAIS
              </a>
            </div>
            <img
              style={{ top: "-5px", scale: "1.1" }}
              src={energeticos}
              alt="Energéticos"
            />
          </div>
          <div className="card-categoria">
            <div className="card-content">
              <h3>Sucos</h3>
              <a href="#" className="saiba-mais">
                SAIBA MAIS
              </a>
            </div>
            <img
              style={{ top: "-10px", scale: "1.1" }}
              src={sucos}
              alt="Sucos"
            />
          </div>
          <div className="card-categoria">
            <div className="card-content">
              <h3>Vinhos</h3>
              <a href="#" className="saiba-mais">
                SAIBA MAIS
              </a>
            </div>
            <img
              style={{ top: "-30px", scale: "1" }}
              src={vinhos}
              alt="Vinhos"
            />
          </div>
        </section>

        <section className="parceiros">
          <h2 style={{ marginTop: "220px" }} className="titulo-parceiros">
            <span
              style={{
                color: "#2B4A6B",
                fontWeight: "bold",
                fontSize: "40px",
              }}
            >
              Conheca alguns dos{" "}
            </span>
            <span
              style={{
                color: "#728BA6",
                fontWeight: "bold",
                fontSize: "40px",
              }}
            >
              nossos parceiros
            </span>
          </h2>
          <p style={{ color: "#92949F", fontSize: "25px", marginTop: "50px" }}>
            Nossos parceiros são parte essencial da nossa missão: conectar quem
            vende com quem precisa, de forma simples e eficiente.
          </p>

          <div className="fotos-parceiros">
            <div className="parceiro">
              <img src={felipeSouza} alt="Felipe Souza" />
              <h4>Felipe Souza</h4>
              <p>Fornecedor de Refrigerante</p>
            </div>
            <div className="parceiro">
              <img src={marianaNunes} alt="Mariana Nunes" />
              <h4>Mariana Nunes</h4>
              <p>Fornecedora de Vinho</p>
            </div>
            <div className="parceiro">
              <img src={beatrizFreitas} alt="Beatriz Freitas" />
              <h4>Beatriz Freitas</h4>
              <p>Fornecedora de Suco</p>
            </div>
            <div className="parceiro">
              <img src={vanessaMartins} alt="Vanessa Martins" />
              <h4>Vanessa Martins</h4>
              <p>Fornecedora de Cerveja</p>
            </div>
            <div className="botao-fornecedor">
              <Link to="/fornecedores" className="ver-fornecedores-btn">
                VER TODOS OS FORNECEDORES
              </Link>
            </div>
          </div>
        </section>
      </section>
    </section>
  );
};

export default HeroSection;
