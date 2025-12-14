import { useState } from "react";
import FormReserva from "../../components/reserva/FormularioReserva";
import MisReservas from "../../pages/user/MisReservas";

export default function Reservas() {
  const [reloadFlag, setReloadFlag] = useState(false);

  const recargarReservas = () => {
    setReloadFlag((prev) => !prev);
  };

  return (
    <div>
      <MisReservas reloadFlag={reloadFlag} />
      <FormReserva onReservaCreada={recargarReservas} />
    </div>
  );
}
