import React from "react";
import SobreNosotros from "./SobreNosotros";
import Galeria from "./Galeria";
import Resenias from "./Resenias";
import Header from "../../layout/Header.jsx";
import Footer from "../../layout/Footer.jsx";

const Home = () => {
  return (
    <>
      <Header />
      <main>
        <section id="galeria">
          <Galeria />
        </section>
        <section id="resenias">
          <Resenias />
        </section>
        <section id="sobre-nosotros">
          <SobreNosotros />
        </section>
      </main>
      <Footer />
    </>
  );
};

export default Home;
