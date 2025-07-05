import ProdutoList from "../../components/produtoList";
import SideNavBar from "../../components/sideNavBar";
import Carrossel from "../../components/carrossel";
import { useSearchParams } from "react-router-dom";
import "../../styles/startPage.css";

const imagensBanner = [
  "https://www.bioleve.com.br/img/intro_img/banner-sucos.jpg",
  "https://bebidaspinheirense.com.br/wp-content/uploads/2024/05/BANNERS-1200X330PX-2.jpg",
  "https://www.imigrantesbebidas.com.br/bebida/images/promo/250228_banner_hero_categorias34.jpg",
];

function StartPage() {
  // const [searchParams] = useSearchParams()
  return (
    <>
      <div className="start-page">
        <Carrossel imagens={imagensBanner} />
        {/* <SideNavBar tipoUsuario = {searchParams.get('tipoUsuario')}/> */}
        <SideNavBar tipoUsuario={sessionStorage.getItem("tipoUsuario")} />
        <ProdutoList />
      </div>
    </>
  );
}
export default StartPage;
