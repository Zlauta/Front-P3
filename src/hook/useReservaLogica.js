import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { crearReserva, obtenerReservas } from "../service/reservas.service.js";

export const useReservaLogica = (watch, reset) => {
  const [loading, setLoading] = useState(false);
  const [minDate, setMinDate] = useState("");
  const [minTime, setMinTime] = useState("");
  const [reservasOcupadas, setReservasOcupadas] = useState([]);

  const fechaSeleccionada = watch("fecha");
  const mesaSeleccionada = watch("mesa");
  const personasSeleccionadas = watch("cantidadPersonas");

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const data = await obtenerReservas();
        setReservasOcupadas(data);
      } catch (error) {
        console.error("Error al cargar disponibilidad:", error);
      }
    };
    cargarDatos();
  }, []);

  useEffect(() => {
    const hoy = new Date();
    const yyyy = hoy.getFullYear();
    const mm = String(hoy.getMonth() + 1).padStart(2, "0");
    const dd = String(hoy.getDate()).padStart(2, "0");
    setMinDate(`${yyyy}-${mm}-${dd}`);
  }, []);

  useEffect(() => {
    if (!fechaSeleccionada) return;
    const hoy = new Date();
    const fechaElegida = new Date(fechaSeleccionada + "T00:00:00");

    if (fechaElegida.toDateString() === hoy.toDateString()) {
      const hh = String(hoy.getHours()).padStart(2, "0");
      const mm = String(hoy.getMinutes()).padStart(2, "0");
      setMinTime(`${hh}:${mm}`);
    } else {
      setMinTime("");
    }
  }, [fechaSeleccionada]);

  const validarCapacidadMesa = (mesa, personas) => {
    if (!mesa || !personas) return true;
    const m = parseInt(mesa);
    const p = parseInt(personas);

    if (p > 10) return "Para más de 10 personas, contáctenos por teléfono.";
    if (m >= 1 && m <= 10 && p > 2)
      return `Mesa ${m} es chica (máx 2p). Elija mayor a 10.`;
    if (m >= 11 && m <= 20 && p > 4)
      return `Mesa ${m} es estándar (máx 4p). Elija mayor a 20.`;
    if (m >= 21 && m <= 25 && p > 6)
      return `Mesa ${m} es mediana (máx 6p). Elija mayor 25.`;
    if (m > 30) return "Número de mesa inválido.";

    return true;
  };

  const validarHorarioAtencion = (horaString) => {
    if (!horaString) return true;
    const [horas, minutos] = horaString.split(":").map(Number);
    const minutosTotales = horas * 60 + minutos;
    const esTurnoManana = minutosTotales >= 600 && minutosTotales <= 960;
    const esTurnoNoche = minutosTotales >= 1260 && minutosTotales <= 1439;
    const esTurnoMadrugada = minutosTotales >= 0 && minutosTotales <= 120;
    if (esTurnoManana || esTurnoNoche || esTurnoMadrugada) {
      return true;
    }
    return "Cerrado. Horarios: 10-16hs y 21-02hs";
  };

  const verificarDisponibilidad = (horaInput) => {
    if (!fechaSeleccionada || !mesaSeleccionada || !horaInput) return true;

    const convertirAMinutos = (h) => {
      const [hr, min] = h.split(":").map(Number);
      return hr * 60 + min;
    };

    const minutosInput = convertirAMinutos(horaInput);

    const conflicto = reservasOcupadas.find((reserva) => {
      const fechaReserva = new Date(reserva.fecha).toISOString().split("T")[0];
      if (fechaReserva !== fechaSeleccionada) return false;
      if (String(reserva.mesa) !== String(mesaSeleccionada)) return false;

      const minutosReserva = convertirAMinutos(reserva.hora);
      return Math.abs(minutosInput - minutosReserva) < 120; // 120 min = 2hs
    });

    return !conflicto;
  };

  const handleReservaSubmit = async (data) => {
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");
    if (!token) {
      Swal.fire({
        icon: "warning",
        title: "Acceso denegado",
        text: "Debes iniciar sesión.",
        confirmButtonColor: "#e6ad00",
      });
      return;
    }

    setLoading(true);

    try {
      const fechaSegura = data.fecha + "T12:00:00";

      const datosAEnviar = {
        ...data,
        fecha: fechaSegura,
      };
      const respuesta = await crearReserva(datosAEnviar);
      console.log("RESPUESTA DEL BACK:", respuesta);
      if (respuesta.correo?.enviado) {
        Swal.fire({
          icon: "success",
          title: "¡Reserva creada!",
          text: "La reserva fue creada y el correo fue enviado correctamente.",
          confirmButtonColor: "#1aaf4b",
          timer: 3000,
        });
      } else {
        Swal.fire({
          icon: "warning",
          title: "Reserva creada",
          text: "La reserva se creó, pero no se pudo enviar el correo.",
          confirmButtonColor: "#e6ad00",
        });
      }

      reset();

      const dataActualizada = await obtenerReservas();
      setReservasOcupadas(dataActualizada);
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.message || "Error al reservar",
        confirmButtonColor: "#d33",
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    minDate,
    minTime,
    fechaSeleccionada,
    mesaSeleccionada,
    personasSeleccionadas,
    validarCapacidadMesa,
    verificarDisponibilidad,
    handleReservaSubmit,
    validarHorarioAtencion,
  };
};
