import React from "react";
import "../../styles/heroSection.css";
import cocaColaImage from "../../assets/cocaCola.svg";
import rectangleImage from "../../assets/Rectangle1.svg";

const HeroSection = () => {
  return (
    <div className="hero">
      <div className="hero-content">
        <h1>Smart Supplies</h1>
        <p>Conectamos você aos melhores fornecedores</p>
        <p className="hero-text">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam
          vehicula, felis at commodo venenatis, lorem purus tristique sapien, ac
          fermentum velit nunc at risus.
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
  );
};

export default HeroSection;
