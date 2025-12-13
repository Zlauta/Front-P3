import { useEffect, useState } from "react";
import { obtenerResenias } from "@/service/resenias.service.js";
import CarruselResenia from "@/components/resenias/CarruselResenias.jsx";

const Resenias = () => {
  const [resenias, setResenias] = useState([]);

  const cargarResenias = async () => {
    const data = await obtenerResenias();
    setResenias(data);
  };

  useEffect(() => {
    cargarResenias();
  }, []);
  return (
    <>
      <CarruselResenia resenias={resenias} updateList={cargarResenias} />
    </>
  );
};

export default Resenias;
