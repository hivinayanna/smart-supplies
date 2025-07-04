import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "../pages/Home";
import Fornecedores from "../components/fornecedores";
import Footer from "../components/footer";
import Login from "../components/login";
import Auth from "../pages/Auth";

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
          <Route path="/auth" element={<Auth />} />
          <Route path="/fornecedores" element={<Fornecedores />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default AppRoutes;
