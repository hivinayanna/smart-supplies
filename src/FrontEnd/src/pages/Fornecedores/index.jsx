import React from "react";
import { useState, useEffect } from "react";
import Fornecedores from "../../components/fornecedores";
import Footer from "../../components/footer";
import SideNavBar from "../../components/sideNavBar";
import "../../styles/fornecedoresPage.css";


function ListarFornecedores() {
  return (
    <div className="fornecedores-page-container">
      <div className="main-content">
        <SideNavBar />
        <div className="fornecedores-content">
          <Fornecedores/>
        </div>
      </div>
      <Footer/>
    </div>
  );
}

export default ListarFornecedores;
