import React, { useEffect, useState } from "react";
import  { Navigate } from "react-router-dom";
import ProdutoCard from "../produtoCard";
import "../../styles/produtoList.css";
import { use } from "react";

function ProdutoList() {
  // Estado para armazenar os produtos simulados
  const [produtos, setProdutos] = useState([]);

  // Estado para armazenar o valor digitado na barra de pesquisa
  const [busca, setBusca] = useState("");

  // Estado para controlar a categoria selecionada no filtro
  const [categoriaSelecionada, setCategoriaSelecionada] = useState("");

  // Estado para redirecionar para login
  const [redirectToLogin, setRedirectToLogin] = useState(false);

  // Busca a lista de produtos no bakend
  useEffect(() => {
    const host = import.meta.env.REACT_APP_HOST || "http://localhost:8000"; 
    const fetchData = async () => {
      const token = sessionStorage.getItem('accessToken');

      if (!token) {
        // Se não houver token, redireciona para a página de login
        setRedirectToLogin(true);
        return;
      }

      try {
        const response = await fetch(`${host}/api/produtos/`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        });

        if (response.status === 401){
          console.log("Unauthorized login")
          setRedirectToLogin(true);
          return;
        }

        let produtos_json = await response.json();
        setProdutos(produtos_json); 

      } catch (error){
        console.error('Erro ao buscar produtos:', error);
      }
    };

    fetchData();
  }, []);

  if (redirectToLogin) {
    return <Navigate to="/Auth?sessionExpired=true" replace />;
  }

  // Extração de categorias únicas dos produtos
  const categorias = [...new Set(produtos.map(p => p.categoria.nome))];

  // Filtragem dos produtos com base na busca e na categoria selecionada
  const produtosFiltrados = produtos.filter(p => {
    const nomeMatch = p.nome.toLowerCase().includes(busca.toLowerCase());
    const categoriaMatch = categoriaSelecionada ? p.categoria.nome === categoriaSelecionada : true;
    return nomeMatch && categoriaMatch;
  });

  return (
    <div className="produto-list-container">
      
      {/*  SEÇÃO LATERAL DE CATEGORIAS / FILTROS */}
      <div className="produto-filtros">
        <h3>Filtrar por categoria</h3>
        <ul>
          {/* Opção para mostrar todos os produtos */}
          <li
            onClick={() => setCategoriaSelecionada("")}
            className={!categoriaSelecionada ? "ativa" : ""}
          >
            Todos
          </li>

          {/* Lista de categorias únicas */}
          {categorias.map((cat, i) => (
            <li
              key={i}
              onClick={() => setCategoriaSelecionada(cat)}
              className={categoriaSelecionada === cat ? "ativa" : ""}
            >
              {cat}
            </li>
          ))}
        </ul>
      </div>

      {/* SEÇÃO PRINCIPAL: BARRA DE PESQUISA + LISTA DE CARDS */}
      <div className="produto-content">

        {/* BARRA DE PESQUISA */}
        <input
          type="text"
          placeholder="Pesquisar produtos..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="barra-pesquisa"
        />

        {/* ÁREA ONDE OS PRODUTOS (CARDS) SÃO EXIBIDOS */}
        <div className="produto-cards">
          {produtosFiltrados.map((produto) => (
            <ProdutoCard key={produto.id} produto={produto} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProdutoList;
