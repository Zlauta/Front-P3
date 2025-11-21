import React from "react";
import SobreNosotros from "./SobreNosotros";
import Galeria from "./Galeria";
import Resenias from "./Resenias";
import Header from "../../layout/Header.jsx";

const Home = () => {
  return (
    <>
      <Header />
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
