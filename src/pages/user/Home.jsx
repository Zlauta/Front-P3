import React from "react";
import SobreNosotros from "./SobreNosotros";
import Galeria from "./Galeria";
import Resenias from "./Resenias";
import Header from "../../components/navegacionUser/Header.jsx";
import Footer from "../../components/navegacionUser/Footer.jsx";

const Home = () => {
  return (
    <>
      <main>
        <section id="galeria">
          <Galeria />
        </section>
        <section id="sobre-nosotros">
          <SobreNosotros />
        </section>
        <section id="resenias">
          <Resenias />
        </section>
      </main>
    </>
  );
};

export default Home;
