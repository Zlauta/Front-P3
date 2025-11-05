import React from "react";
import SobreNosotros from "./SobreNosotros";
import Galeria from "./Galeria";
import Resenias from "./Resenias";

const Home = () => {
  return (
    <main>
      <section id="sobre-nosotros">
        <SobreNosotros />
      </section>

      <section id="galeria">
        <Galeria />
      </section>

      <section id="resenias">
        <Resenias />
      </section>
    </main>
  );
};

export default Home;
