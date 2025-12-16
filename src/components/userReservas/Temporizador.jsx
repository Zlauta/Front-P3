import { useEffect, useState } from "react";

export default function Temporizador({ fecha, hora }) {
  const [tiempo, setTiempo] = useState("");
  const [color, setColor] = useState("text-light");

  useEffect(() => {
    const calcularTiempo = () => {
      // Asumimos fecha YYYY-MM-DD y hora HH:mm
      const fechaISO = new Date(fecha).toISOString().split("T")[0];
      const objetivo = new Date(`${fechaISO}T${hora}:00`);
      const ahora = new Date();
      const diferencia = objetivo - ahora;

      if (diferencia <= 0) {
        setTiempo("¡Es hoy! / Ya pasó");
        setColor("text-danger fw-bold");
        return;
      }

      const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));
      const horas = Math.floor((diferencia / (1000 * 60 * 60)) % 24);
      const minutos = Math.floor((diferencia / (1000 * 60)) % 60);
      const segundos = Math.floor((diferencia / 1000) % 60);

      let texto = "";
      if (dias > 0) texto += `${dias}d `;
      texto += `${horas}h ${minutos}m ${segundos}s`;

      setTiempo(texto);

      // Cambiar a amarillo si faltan menos de 2 horas
      if (dias === 0 && horas < 2) {
        setColor("text-warning fw-bold");
      } else {
        setColor("text-success fw-bold");
      }
    };

    calcularTiempo();
    const intervalo = setInterval(calcularTiempo, 1000);
    return () => clearInterval(intervalo);
  }, [fecha, hora]);

  return <span className={color}>{tiempo}</span>;
}