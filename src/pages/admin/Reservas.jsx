import { useEffect, useState } from "react";
import { Table, Button, Modal, Form } from "react-bootstrap";
import Swal from "sweetalert2";
import { obtenerReservas, actualizarReserva, eliminarReserva } from "../../service/reservas.service.js";
import "../../index.css";

const convertirAMinutos = (horaString) => {
  return horaString.split(":").reduce((total, valor) => total * 60 + +valor, 0);
};

const formatearFecha = (isoString) => {
  return isoString ? new Date(isoString).toLocaleDateString('es-ES', { timeZone: 'UTC' }) : "";
};

const notificar = (mensaje, icono = "error") => {
  Swal.fire({
    title: mensaje,
    icon: icono,
    confirmButtonColor: "#1aaf4b",
    timer: icono === "success" ? 1500 : undefined
  });
};


const validarReservaCompleta = (datos, listaReservas, idReservaActual) => {
  const { fecha, hora, mesa, cantidadPersonas } = datos;
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0); 
  
  // 1. Validar Fecha
  if (new Date(fecha + "T00:00:00") < hoy) return "La fecha no puede ser anterior a hoy.";

  const minutos = convertirAMinutos(hora);
  const turnoMañana = minutos >= 600 && minutos <= 960; 
  const turnoNoche = minutos >= 1260 && minutos <= 1439;
  const turnoMadrugada = minutos >= 0 && minutos <= 120;
  
  if (!turnoMañana && !turnoNoche && !turnoMadrugada) {
    return "Cerrado. Horarios: 10-16hs y 21-02hs";
  }

  const numMesa = parseInt(mesa);
  const numPersonas = parseInt(cantidadPersonas);

  if (numPersonas > 10) return "Para más de 10 personas, contactar por teléfono.";
  if (numMesa <= 10 && numPersonas > 2) return `Mesa ${numMesa} es chica (máx 2p).`;
  if (numMesa > 10 && numMesa <= 20 && numPersonas > 4) return `Mesa ${numMesa} es estándar (máx 4p).`;
  if (numMesa > 20 && numMesa <= 25 && numPersonas > 6) return `Mesa ${numMesa} es mediana (máx 6p).`;
  if (numMesa > 30) return "Número de mesa inválido.";

  const existeConflicto = listaReservas.find((reserva) => {
    if (reserva._id === idReservaActual) return false; 
    
    const fechaReserva = new Date(reserva.fecha).toISOString().split("T")[0];
    if (fechaReserva !== fecha || String(reserva.mesa) !== String(mesa)) return false;
    
    const diferenciaMinutos = Math.abs(minutos - convertirAMinutos(reserva.hora));
    return diferenciaMinutos < 120;
  });

  if (existeConflicto) return `Mesa ${mesa} ocupada en ese horario (margen de 2hs).`;

  return null;
};


export default function ReservasAdmin() {
  const [reservas, setReservas] = useState([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [reservaEditada, setReservaEditada] = useState(null);
  const [horaMinima, setHoraMinima] = useState("");

  const cargarDatos = async () => {
    try {
      const datos = await obtenerReservas();
      setReservas(datos);
    } catch (error) {
      console.error(error);
      notificar("Error al cargar reservas");
    }
  };

  useEffect(() => { cargarDatos(); }, []);

  useEffect(() => {
    if (!reservaEditada?.fecha) return;
    const fechaInput = new Date(reservaEditada.fecha + "T00:00:00");
    const esHoy = fechaInput.toDateString() === new Date().toDateString();
    
    setHoraMinima(esHoy ? new Date().toTimeString().slice(0, 5) : "");
  }, [reservaEditada?.fecha]);

  const abrirModal = (reserva) => {
    const fechaInput = new Date(reserva.fecha).toISOString().split("T")[0];
    setReservaEditada({ ...reserva, fecha: fechaInput });
    setMostrarModal(true);
  };

  const guardarCambios = async () => {
    const errorValidacion = validarReservaCompleta(reservaEditada, reservas, reservaEditada._id);
    
    if (errorValidacion) {
      return notificar(errorValidacion, "warning");
    }

    try {
      await actualizarReserva(reservaEditada._id, reservaEditada);
      await cargarDatos();
      setMostrarModal(false);
      notificar("Reserva actualizada correctamente!", "success");
    } catch (error) {
      notificar(error.response?.data?.message || "Error al actualizar");
    }
  };

  const eliminar = async (id) => {
    const confirmacion = await Swal.fire({
      title: "¿Eliminar?",
      text: "No podrás deshacer esto",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar"
    });

    if (!confirmacion.isConfirmed) return;

    try {
      await eliminarReserva(id);
      await cargarDatos();
      notificar("Eliminada correctamente", "success");
    } catch (error) {
      notificar("Error al eliminar");
    }
  };
  const camposFormulario = [
    { label: "Mesa", name: "mesa", type: "number" },
    { label: "Cantidad Personas", name: "cantidadPersonas", type: "number" },
    { label: "Fecha", name: "fecha", type: "date" },
    { label: "Hora", name: "hora", type: "time", min: horaMinima }
  ];

  return (
    <div className="p-1">
      <h3 className="text-light fs-1 mt-5 mb-5">Administrador de Reservas</h3>
      
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            {["Usuario", "Mesa", "Personas", "Fecha", "Hora", "Notas", "Acciones"].map(titulo => (
              <th key={titulo} className="tabla">{titulo}</th>
            ))}
          </tr>
        </thead>
        <tbody style={{ background: "#1E2A26" }}>
          {reservas.length > 0 ? (
            reservas.map((reserva) => (
              <tr key={reserva._id}>
                <td className="tabla">{reserva.usuario?.email || "Usuario eliminado"}</td>
                <td className="tabla">{reserva.mesa}</td>
                <td className="tabla">{reserva.cantidadPersonas}</td>
                <td className="tabla">{formatearFecha(reserva.fecha)}</td>
                <td className="tabla">{reserva.hora}</td>
                <td className="tabla">{reserva.notas || "-"}</td>
                <td className="tabla d-flex gap-2 justify-content-center">
                  <Button size="sm" variant="secondary" onClick={() => abrirModal(reserva)}>
                    Editar
                  </Button>
                  <Button size="sm" variant="danger" onClick={() => eliminar(reserva._id)}>
                    Eliminar
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr><td colSpan={7} className="text-center text-light py-4">No hay reservas registradas.</td></tr>
          )}
        </tbody>
      </Table>
      
      <div className="text-light fs-5">Total: {reservas.length} reservas</div>

      {/* MODAL DE EDICIÓN */}
      <Modal show={mostrarModal} onHide={() => setMostrarModal(false)} centered>
        <Modal.Header closeButton className="bg-dark text-white border-success">
          <Modal.Title>Editar Reserva</Modal.Title>
        </Modal.Header>
        
        <Modal.Body className="bg-dark text-white">
          {reservaEditada && (
            <Form>
              {camposFormulario.map((campo) => (
                <Form.Group className="mb-3" key={campo.name}>
                  <Form.Label>{campo.label}</Form.Label>
                  <Form.Control 
                    type={campo.type} 
                    name={campo.name} 
                    min={campo.min} 
                    value={reservaEditada[campo.name]} 
                    onChange={e => setReservaEditada({ ...reservaEditada, [e.target.name]: e.target.value })} 
                  />
                </Form.Group>
              ))}

              <Form.Group>
                <Form.Label>Notas</Form.Label>
                <Form.Control 
                  as="textarea" 
                  rows={3} 
                  name="notas" 
                  value={reservaEditada.notas} 
                  onChange={e => setReservaEditada({ ...reservaEditada, notas: e.target.value })} 
                />
              </Form.Group>
            </Form>
          )}
        </Modal.Body>
        
        <Modal.Footer className="bg-dark border-success">
          <Button variant="secondary" onClick={() => setMostrarModal(false)}>Cancelar</Button>
          <Button variant="success" onClick={guardarCambios}>Guardar Cambios</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}