// routes.jsx
import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "../pages/Home";
import Auth from "../pages/Auth";
import Carrinho from "../pages/Carrinho";
import StartPage from "../pages/StartPage";
import MeusProdutos from "../pages/MeusProdutos";
import ListaDesejos from "../pages/ListaDesejos";
import ProdutoDetalhes from "../pages/ProdutoDetalhes";
import Fornecedores from "../pages/Fornecedores";
import HistoricoPage from "../pages/HistoricoPage";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Auth" element={<Auth />} />
        <Route path="/Start" element={<StartPage />} />
        <Route path="/carrinho" element={<Carrinho />} />
        <Route path="/meus-produtos" element={<MeusProdutos />} />
        <Route path="/fornecedores" element={<Fornecedores />} />
        <Route path="/lista-desejos" element={<ListaDesejos />} />
        <Route path="/historico" element={<HistoricoPage />} />
        <Route path="/produto/:id" element={<ProdutoDetalhes />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
