import React from "react";
import SobreNosotros from "./SobreNosotros";
import Galeria from "./Galeria";
import Resenias from "./Resenias";

const Inicio = () => {
  return (
    <>
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
    </>
  );
};

export default Inicio;
