import React, { useState } from "react";
import "../../styles/fornecedores.css";

//imagens dos fornecedores
import felipeSouza from "../../assets/felipe-souza.svg";
import marianaNunes from "../../assets/mariana-nunes.svg";
import vanessaMartins from "../../assets/vanessa-martins.svg";
import beatrizFreitas from "../../assets/beatriz-freitas.svg";

const Fornecedores = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const fornecedores = [
    {
      id: 1,
      nome: "Felipe Souza",
      imagem: felipeSouza,
      descricao:
        "Oferecemos as principais marcas de refrigerantes com preços competitivos e pronta entrega para sua revenda.",
    },
    {
      id: 2,
      nome: "Mariana Nunes",
      imagem: marianaNunes,
      descricao:
        "Trabalhamos com uma seleção especial de vinhos nacionais e importados, ideais para bares, adegas e eventos.",
    },
    {
      id: 3,
      nome: "Vanessa Martins",
      imagem: vanessaMartins,
      descricao:
        "Especialista em cervejas artesanais e comerciais, atendemos com variedade e logística rápida para o seu negócio.",
    },
    {
      id: 4,
      nome: "Beatriz Freitas",
      imagem: beatrizFreitas,
      descricao:
        "Distribuímos sucos naturais e industrializados com qualidade garantida e suporte para estabelecimentos de todos os portes.",
    },
  ];

  const fornecedoresFiltrados = fornecedores.filter((fornecedor) =>
    fornecedor.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );
  return (
    <div className="fornecedores-container">
      <div className="search-bar">
        <input
          type="text"
          placeholder="Pesquise pelo nome"
          className="search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className="search-button">
          <i className="fas fa-search"></i>
        </button>
      </div>

      <div className="fornecedores-grid">
        {fornecedoresFiltrados.map((fornecedor) => (
          <div key={fornecedor.id} className="fornecedor-card">
            <img
              src={fornecedor.imagem}
              alt={fornecedor.nome}
              style={
                fornecedor.nome === "Beatriz Freitas"
                  ? { objectPosition: "50% 40%" }
                  : undefined
              }
            />
            <div className="fornecedor-info">
              <div className="fornecedor-header">
                <i className="fas fa-user"></i>
                <h3>{fornecedor.nome}</h3>
              </div>
              <p>{fornecedor.descricao}</p>
              <a href="#" className="ver-catalogo">
                VER CATÁLOGO
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Fornecedores;
