import React, { useEffect, useState } from "react";
import ProdutoCard from "../produtoCard";
import "../../styles/produtoList.css";

function ProdutoList() {
  // Estado para armazenar os produtos simulados
  const [produtos, setProdutos] = useState([]);

  // Estado para armazenar o valor digitado na barra de pesquisa
  const [busca, setBusca] = useState("");

  // Estado para controlar a categoria selecionada no filtro
  const [categoriaSelecionada, setCategoriaSelecionada] = useState("");

  // Simulação de fetch de dados (produtos mockados)
useEffect(() => {
  const mockProdutos = [
    {
      id: 1,
      nome: "Cachaça Pimba",
      descricao: "Cachaça do Dava Jones, a melhor do Brasil!",
      preco: 79.9,
      quantidade_estoque: 15,
      categoria: { nome: "Pinga" },
      fornecedor: { nome: "Loja DavaStore" },
      imagem: "https://cdn.dooca.store/4309/products/701d27b0222a52d1980f7e84ff282b4c.jpg?v=1653064450"
    },
    {
      id: 7,
      nome: "Cachaça Mineirinha",
      descricao: "Tradicional cachaça artesanal de Minas Gerais.",
      preco: 59.9,
      quantidade_estoque: 10,
      categoria: { nome: "Pinga" },
      fornecedor: { nome: "Armazém Minas" },
      imagem: "https://cdn.dooca.store/4309/products/701d27b0222a52d1980f7e84ff282b4c.jpg?v=1653064450"
    },
    {
      id: 2,
      nome: "Cerveja DevBier",
      descricao: "Cerveja artesanal feita por devs para devs.",
      preco: 12.5,
      quantidade_estoque: 50,
      categoria: { nome: "Cerveja" },
      fornecedor: { nome: "Cervejaria Devs" },
      imagem: "https://cdn.dooca.store/4309/products/701d27b0222a52d1980f7e84ff282b4c.jpg?v=1653064450"
    },
    {
      id: 8,
      nome: "Cerveja Git Lager",
      descricao: "Ideal para relaxar depois de um push.",
      preco: 10.9,
      quantidade_estoque: 40,
      categoria: { nome: "Cerveja" },
      fornecedor: { nome: "DevBrew" },
      imagem: "https://cdn.dooca.store/4309/products/701d27b0222a52d1980f7e84ff282b4c.jpg?v=1653064450"
    },
    {
      id: 3,
      nome: "Whisky Code Label",
      descricao: "Um blend premium para noites de deploy.",
      preco: 199.9,
      quantidade_estoque: 8,
      categoria: { nome: "Whisky" },
      fornecedor: { nome: "CodeStore" },
      imagem: "https://cdn.dooca.store/4309/products/701d27b0222a52d1980f7e84ff282b4c.jpg?v=1653064450"
    },
    {
      id: 9,
      nome: "Whisky Night Build",
      descricao: "O companheiro ideal para builds demoradas.",
      preco: 169.9,
      quantidade_estoque: 12,
      categoria: { nome: "Whisky" },
      fornecedor: { nome: "Whisky Devs" },
      imagem: "https://cdn.dooca.store/4309/products/701d27b0222a52d1980f7e84ff282b4c.jpg?v=1653064450"
    },
    {
      id: 4,
      nome: "Vodka Debug",
      descricao: "Tira todos os bugs da sua mente.",
      preco: 49.9,
      quantidade_estoque: 20,
      categoria: { nome: "Vodka" },
      fornecedor: { nome: "Debug Drinks" },
      imagem: "https://cdn.dooca.store/4309/products/701d27b0222a52d1980f7e84ff282b4c.jpg?v=1653064450"
    },
    {
      id: 10,
      nome: "Vodka FullStack",
      descricao: "Vai do backend ao frontend sem erro!",
      preco: 39.9,
      quantidade_estoque: 18,
      categoria: { nome: "Vodka" },
      fornecedor: { nome: "StackBebidas" },
      imagem: "https://cdn.dooca.store/4309/products/701d27b0222a52d1980f7e84ff282b4c.jpg?v=1653064450"
    },
    {
      id: 5,
      nome: "Licor Sweet Commit",
      descricao: "Doce e suave, ideal para comemorar merges sem conflitos.",
      preco: 34.5,
      quantidade_estoque: 25,
      categoria: { nome: "Licor" },
      fornecedor: { nome: "Liquor Devs" },
      imagem: "https://cdn.dooca.store/4309/products/701d27b0222a52d1980f7e84ff282b4c.jpg?v=1653064450"
    },
    {
      id: 11,
      nome: "Licor Dark Merge",
      descricao: "Um toque amargo para lidar com conflitos no Git.",
      preco: 37.9,
      quantidade_estoque: 14,
      categoria: { nome: "Licor" },
      fornecedor: { nome: "MergeStore" },
      imagem: "https://cdn.dooca.store/4309/products/701d27b0222a52d1980f7e84ff282b4c.jpg?v=1653064450"
    },
    {
      id: 6,
      nome: "Energetico StackOverflow",
      descricao: "Mantém você acordado até passar todos os testes.",
      preco: 8.9,
      quantidade_estoque: 60,
      categoria: { nome: "Energético" },
      fornecedor: { nome: "PowerDrink Co." },
      imagem: "https://cdn.dooca.store/4309/products/701d27b0222a52d1980f7e84ff282b4c.jpg?v=1653064450"
    },
    {
      id: 12,
      nome: "Energetico FrontFuel",
      descricao: "Ideal para longas noites de codificação em React.",
      preco: 9.5,
      quantidade_estoque: 55,
      categoria: { nome: "Energético" },
      fornecedor: { nome: "CodeBoost" },
      imagem: "https://cdn.dooca.store/4309/products/701d27b0222a52d1980f7e84ff282b4c.jpg?v=1653064450"
    }
  ];

  setProdutos(mockProdutos);
}, []);



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
