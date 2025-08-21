import ProdutoList from "../../components/produtoList";
import SideNavBar from "../../components/sideNavBar";
import Carrossel from "../../components/carrossel";
import Footer from "../../components/footer";
import { useSearchParams } from "react-router-dom";
import "../../styles/startPage.css";

const imagensBanner = [
  "https://res.cloudinary.com/dj5eeszbx/image/upload/v1755177973/cerveja_iyewmx.webp",
  "https://res.cloudinary.com/dj5eeszbx/image/upload/v1755178576/whisky_j9yv9n.webp",
  "https://res.cloudinary.com/dj5eeszbx/image/upload/v1755179227/schweppesbanner_ngbkln.webp",
];

function StartPage() {
  // const [searchParams] = useSearchParams()
  return (
    <>
      <div className="start-page">
        <Carrossel imagens={imagensBanner} />
        {/* <SideNavBar tipoUsuario = {searchParams.get('tipoUsuario')}/> */}
        <SideNavBar />
        <ProdutoList />
        <Footer />
      </div>
    </>
  );
}
export default StartPage;
