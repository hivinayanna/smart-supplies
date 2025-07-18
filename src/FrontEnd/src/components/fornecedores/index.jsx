import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import "../../styles/fornecedores.css";

//imagens dos fornecedores
import felipeSouza from "../../assets/felipe-souza.svg";
import marianaNunes from "../../assets/mariana-nunes.svg";
import vanessaMartins from "../../assets/vanessa-martins.svg";
import beatrizFreitas from "../../assets/beatriz-freitas.svg";

const Fornecedores = () => {
  const [searchTerm, setSearchTerm] = useState("");

   // Estado para redirecionar para login
  const [redirectToLogin, setRedirectToLogin] = useState(false);

  const [fornecedores, setFornecedores] = useState([]);

  // Busca a lista de produtos no bakend
  useEffect(() => {
    const host = import.meta.env.REACT_APP_HOST || "http://localhost:8000";
    const fetchData = async () => {
      const token = sessionStorage.getItem("accessToken");

      if (!token) {
        // Se não houver token, redireciona para a página de login
        setRedirectToLogin(true);
        return;
      }

      try {
        const response = await fetch(`${host}/api/fornecedores/`, {
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

        let produtos_json = await response.json();
        setFornecedores(produtos_json);
      } catch (error) {
        console.error("Erro ao buscar fornecedores:", error);
      }
    };

    fetchData();
  }, []);

  if (redirectToLogin) {
    return <Navigate to="/Auth?sessionExpired=true" replace />;
  }

  // const fornecedores = [
  //   {
  //     id: 1,
  //     nome: "Felipe Souza",
  //     imagem: felipeSouza,
  //     descricao:
  //       "Oferecemos as principais marcas de refrigerantes com preços competitivos e pronta entrega para sua revenda.",
  //   },
  //   {
  //     id: 2,
  //     nome: "Mariana Nunes",
  //     imagem: marianaNunes,
  //     descricao:
  //       "Trabalhamos com uma seleção especial de vinhos nacionais e importados, ideais para bares, adegas e eventos.",
  //   },
  //   {
  //     id: 3,
  //     nome: "Vanessa Martins",
  //     imagem: vanessaMartins,
  //     descricao:
  //       "Especialista em cervejas artesanais e comerciais, atendemos com variedade e logística rápida para o seu negócio.",
  //   },
  //   {
  //     id: 4,
  //     nome: "Beatriz Freitas",
  //     imagem: beatrizFreitas,
  //     descricao:
  //       "Distribuímos sucos naturais e industrializados com qualidade garantida e suporte para estabelecimentos de todos os portes.",
  //   },
  // ];

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
