import ProdutoList from "../../components/produtoList";
import SideNavBar from "../../components/sideNavBar";
import Footer from "../../components/footer";
import Carrossel from "../../components/carrossel";


const imagensBanner = [
  "https://www.bioleve.com.br/img/intro_img/banner-sucos.jpg",
  "https://bebidaspinheirense.com.br/wp-content/uploads/2024/05/BANNERS-1200X330PX-2.jpg",
  "https://www.imigrantesbebidas.com.br/bebida/images/promo/250228_banner_hero_categorias34.jpg"
];


function StartPage() {
  return (
    <>
      <div className="start-page">
        <Carrossel imagens={imagensBanner} />
        <SideNavBar tipoUsuario = {"vendedor"}/>
        <ProdutoList />
      </div>
      <Footer />
    </>
  );
}
export default StartPage;
