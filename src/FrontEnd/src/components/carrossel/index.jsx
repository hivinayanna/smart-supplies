import React, { useState, useEffect } from "react";
import "../../styles/carrossel.css";

function Carrossel({ imagens }) {
  const [indiceAtual, setIndiceAtual] = useState(0);

  const proximoSlide = () => {
    setIndiceAtual((prev) => (prev + 1) % imagens.length);
  };

  const slideAnterior = () => {
    setIndiceAtual((prev) => (prev - 1 + imagens.length) % imagens.length);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      proximoSlide();
    }, 7000);
    return () => clearInterval(timer);
  }, [imagens.length]);

  return (
    <div className="carrossel-container">
      <button className="carrossel-btn esquerda" onClick={slideAnterior}>‹</button>

      <div
        className="carrossel-slider"
        style={{ transform: `translateX(-${indiceAtual * 100}%)` }}
      >
        {imagens.map((img, index) => (
          <div className="carrossel-slide" key={index}>
            <img src={img} alt={`Slide ${index + 1}`} className="carrossel-img" />
          </div>
        ))}
      </div>

      <button className="carrossel-btn direita" onClick={proximoSlide}>›</button>
    </div>
  );
}

export default Carrossel;
