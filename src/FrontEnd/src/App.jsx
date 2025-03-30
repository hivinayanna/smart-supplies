import React, { useState } from 'react';

import './styles/App.css';
import AppRoutes from './routes/routes';


//Componente em classe é uma classe que herda e classe componente do react,
//e retorna HTML dentro método render.
class App extends React.Component {


  //metodo responsavel por reenderizar o conteudo HTML do nosso componente
  //usa se {} para colocar variaveis em blocos de HTML.
  render() {
    return (
      <>

        <AppRoutes/>

      </>
    )
  }
}

export default App
