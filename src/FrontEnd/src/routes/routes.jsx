// routes.jsx
import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "../pages/Home";
import Fornecedores from "../components/fornecedores";
import Footer from "../components/footer";

const Layout = ({ children }) => {
  return (
    <>
      {children}
      <Footer />
    </>
  );
};

function AppRoutes() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/fornecedores" element={<Fornecedores />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default AppRoutes;
