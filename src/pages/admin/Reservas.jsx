import { useEffect, useState } from "react";
import { Button, Modal, Form, ButtonGroup } from "react-bootstrap";
import {FaTable } from "react-icons/fa";
import Swal from "sweetalert2";
import { obtenerReservas, actualizarReserva, eliminarReserva } from "@/service/reservas.service.js";
import "@/index.css";
import { 
  validarCapacidadMesa, 
  validarHorarioAtencion, 
  validarConflictoReserva,
  obtenerMesasDisponibles // <--- NUEVO IMPORT
} from "@/utils/reservasUtil.js";
import ReservasTabla from "@/components/adminReserva/ReservaTabla.jsx";
import ReservasClientGrid from "@/components/userReservas/ReservasClienteGrid.jsx";
import { FiGrid } from "react-icons/fi";

const notificar = (mensaje, icono = "error") => {
  Swal.fire({
    title: mensaje,
    icon: icono,
    confirmButtonColor: "#1aaf4b",
    timer: icono === "success" ? 1500 : undefined,
  });
};

export default function ReservasAdmin() {
  const [reservas, setReservas] = useState([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [reservaEditada, setReservaEditada] = useState(null);
  const [horaMinima, setHoraMinima] = useState("");
  const [vista, setVista] = useState("table");

  // --- LOGICA DATOS ---
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

  // --- LOGICA FECHA MÍNIMA ---
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
    const { fecha, mesa, cantidadPersonas, hora, _id } = reservaEditada;

    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    if (new Date(fecha + "T00:00:00") < hoy) return notificar("La fecha no puede ser anterior a hoy.", "warning");

    const errorHorario = validarHorarioAtencion(hora);
    if (errorHorario) return notificar(errorHorario, "warning");

    const errorCapacidad = validarCapacidadMesa(mesa, cantidadPersonas);
    if (errorCapacidad) return notificar(errorCapacidad, "warning");

    const errorConflicto = validarConflictoReserva(reservaEditada, reservas, _id);
    if (errorConflicto) return notificar(errorConflicto, "warning");

    try {
      await actualizarReserva(_id, reservaEditada);
      await cargarDatos();
      setMostrarModal(false);
      notificar("Reserva actualizada correctamente!", "success");
    } catch (error) {
      notificar(error.response?.data?.message || "Error al actualizar");
    }
  };

  const eliminar = async (id) => {
    const confirmacion = await Swal.fire({
      title: "¿Eliminar?", text: "No podrás deshacer esto", icon: "warning",
      showCancelButton: true, confirmButtonColor: "#d33", confirmButtonText: "Sí, eliminar",
    });
    if (!confirmacion.isConfirmed) return;
    try {
      await eliminarReserva(id);
      await cargarDatos();
      notificar("Eliminada correctamente", "success");
    } catch (error) { notificar("Error al eliminar"); }
  };

  const commonProps = { reservas, onEditar: abrirModal, onEliminar: eliminar };

  // Calculamos las mesas para el select dinámico
  const mesasOpciones = reservaEditada?.cantidadPersonas 
    ? obtenerMesasDisponibles(reservaEditada.cantidadPersonas) 
    : [];

  return (
    <div className="p-4">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-5 mt-4">
        <h3 className="text-light fs-1 m-0">Administrador de Reservas</h3>
        <ButtonGroup>
          <Button variant={vista === "grid" ? "success" : "outline-secondary"} onClick={() => setVista("grid")}>
            <FiGrid />
          </Button>
          <Button variant={vista === "table" ? "success" : "outline-secondary"} onClick={() => setVista("table")}>
            <FaTable />
          </Button>
        </ButtonGroup>
      </div>

      {reservas.length === 0 ? (
        <div className="text-center text-light py-5 border rounded bg-dark"><h4>No hay reservas registradas.</h4></div>
      ) : vista === "grid" ? (
        <ReservasClientGrid {...commonProps} />
      ) : (
        <ReservasTabla {...commonProps} />
      )}
      <div className="text-light fs-5 mt-3 text-end">Total: {reservas.length} reservas</div>

      {/* MODAL CON SELECT DINÁMICO */}
      <Modal show={mostrarModal} onHide={() => setMostrarModal(false)} centered>
        <Modal.Header closeButton className="bg-dark text-white border-success">
          <Modal.Title>Editar Reserva</Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-dark text-white">
          {reservaEditada && (
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Cantidad Personas</Form.Label>
                <Form.Control 
                    type="number" 
                    min="1" max="10"
                    value={reservaEditada.cantidadPersonas} 
                    onChange={(e) => {
                        const val = e.target.value;
                        setReservaEditada({...reservaEditada, cantidadPersonas: val, mesa: ""}); // Reset mesa
                    }}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Mesa</Form.Label>
                <Form.Select 
                    value={reservaEditada.mesa} 
                    onChange={(e) => setReservaEditada({...reservaEditada, mesa: e.target.value})}
                    className="bg-secondary text-white border-secondary"
                    disabled={!reservaEditada.cantidadPersonas}
                >
                    <option value="">Seleccione una mesa...</option>
                    {mesasOpciones.map(m => (
                        <option key={m} value={m}>Mesa {m}</option>
                    ))}
                    {/* Mantener mesa actual si queda fuera del rango pero existe */}
                    {reservaEditada.mesa && !mesasOpciones.includes(parseInt(reservaEditada.mesa)) && (
                         <option value={reservaEditada.mesa}>Mesa {reservaEditada.mesa} (Actual)</option>
                    )}
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Fecha</Form.Label>
                <Form.Control type="date" value={reservaEditada.fecha} onChange={(e) => setReservaEditada({...reservaEditada, fecha: e.target.value})}/>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Hora</Form.Label>
                <Form.Control type="time" min={horaMinima} value={reservaEditada.hora} onChange={(e) => setReservaEditada({...reservaEditada, hora: e.target.value})}/>
              </Form.Group>
              <Form.Group>
                <Form.Label>Notas</Form.Label>
                <Form.Control as="textarea" rows={3} value={reservaEditada.notas || ""} onChange={(e) => setReservaEditada({...reservaEditada, notas: e.target.value})}/>
              </Form.Group>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer className="bg-dark border-success">
          <Button variant="secondary" onClick={() => setMostrarModal(false)}>Cancelar</Button>
          <Button variant="success" onClick={guardarCambios} disabled={!reservaEditada?.mesa}>Guardar Cambios</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}