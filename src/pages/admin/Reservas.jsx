import { useEffect, useState } from "react";
import { Table, Button, Modal, Form } from "react-bootstrap";
import Swal from "sweetalert2";
import "../../index.css";
import {
  obtenerReservas,
  actualizarReserva,
  eliminarReserva,
} from "../../service/reservas.service.js";

function formatearFecha(iso) {
  try {
    const fecha = new Date(iso);
    return fecha.toLocaleDateString();
  } catch {
    return iso ?? "";
  }
}

export default function ReservasAdmin() {
  const [reservas, setReservas] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editReserva, setEditReserva] = useState(null);

  const cargar = async () => {
    try {
      const respuesta = await obtenerReservas();
      setReservas(respuesta);
    } catch (error) {
      console.error("Error al cargar reservas:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudieron cargar las reservas",
        confirmButtonColor: "#1aaf4b",
      });
    }
  };

  useEffect(() => {
    cargar();
  }, []);

  const abrirModalEditar = (reserva) => {
    let fechaFormatoInput = "";
    if (reserva.fecha) {
      fechaFormatoInput = new Date(reserva.fecha).toISOString().split("T")[0];
    }

    setEditReserva({
      ...reserva,
      fecha: fechaFormatoInput,
    });
    setShowModal(true);
  };

  const cerrarModal = () => {
    setShowModal(false);
    setEditReserva(null);
  };

  const handleChangeModal = (e) => {
    setEditReserva({
      ...editReserva,
      [e.target.name]: e.target.value,
    });
  };

  const handleGuardarCambios = async () => {
    if (!editReserva) return;

    try {
      await actualizarReserva(editReserva._id, editReserva);

      await cargar();
      cerrarModal();

      Swal.fire({
        title: "Reserva actualizada!",
        icon: "success",
        iconColor: "#1aaf4b",
        confirmButtonColor: "#1aaf4b",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Error al actualizar:", error);
      Swal.fire({
        title: error.response?.data?.message || "Error al actualizar",
        icon: "error",
        confirmButtonColor: "#1aaf4b",
      });
    }
  };

  const manejarEliminar = async (id) => {
    const result = await Swal.fire({
      title: "¿Eliminar esta reserva?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#1aaf4b",
      cancelButtonColor: "#042d12ff",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (!result.isConfirmed) return;

    try {
      await eliminarReserva(id);
      await cargar();

      Swal.fire({
        title: "Reserva eliminada",
        icon: "success",
        iconColor: "#1aaf4b",
        confirmButtonColor: "#1aaf4b",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Error al eliminar:", error);
      Swal.fire({
        title: error.response?.data?.message || "Error al eliminar",
        icon: "error",
        confirmButtonColor: "#1aaf4b",
      });
    }
  };

  return (
    <div className="p-1">
      <h3 className="text-light fs-1 mt-5 mb-5">Administrador de Reservas</h3>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th className="tabla">Usuario</th>
            <th className="tabla">Mesa</th>
            <th className="tabla">Personas</th>
            <th className="tabla">Fecha</th>
            <th className="tabla">Hora</th>
            <th className="tabla">Notas</th>
            <th className="tabla">Acciones</th>
          </tr>
        </thead>
        <tbody style={{ background: "#1E2A26" }}>
          {reservas && reservas.length > 0 ? (
            reservas.map((res) => (
              <tr key={res._id}>
                <td className="tabla">
                  {res.usuario?.email || "Usuario eliminado"}
                </td>
                <td className="tabla">{res.mesa}</td>
                <td className="tabla">{res.cantidadPersonas}</td>
                <td className="tabla">{formatearFecha(res.fecha)}</td>
                <td className="tabla">{res.hora}</td>
                <td className="tabla">{res.notas || "-"}</td>

                <td className="tabla d-flex flex-column flex-lg-row gap-2 justify-content-center">
                  <Button
                    className="btn-tabla"
                    size="sm"
                    variant="secondary"
                    onClick={() => abrirModalEditar(res)}
                  >
                    Editar
                  </Button>

                  <Button
                    className="btn-tabla btn-eliminar"
                    size="sm"
                    variant="success"
                    onClick={() => manejarEliminar(res._id)}
                  >
                    Eliminar
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={8} className="text-center py-4 text-light tabla">
                No hay reservas registradas.
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      <div className="text-light fs-5">
        Total: {reservas?.length || 0} reserva{reservas.length === 1 ? "" : "s"}
      </div>

      <Modal show={showModal} onHide={cerrarModal} centered>
        <Modal.Header
          closeButton
          style={{
            backgroundColor: "#1E2A26",
            color: "white",
            borderBottom: "1px solid #1aaf4b",
          }}
        >
          <Modal.Title>Editar Reserva</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ backgroundColor: "#1E2A26", color: "white" }}>
          {editReserva && (
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Mesa</Form.Label>
                <Form.Control
                  type="number"
                  name="mesa"
                  value={editReserva.mesa}
                  onChange={handleChangeModal}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Cantidad de Personas</Form.Label>
                <Form.Control
                  type="number"
                  name="cantidadPersonas"
                  value={editReserva.cantidadPersonas}
                  onChange={handleChangeModal}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Fecha</Form.Label>
                <Form.Control
                  type="date"
                  name="fecha"
                  value={editReserva.fecha}
                  onChange={handleChangeModal}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Hora</Form.Label>
                <Form.Control
                  type="time"
                  name="hora"
                  value={editReserva.hora}
                  onChange={handleChangeModal}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Notas</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="notas"
                  value={editReserva.notas}
                  onChange={handleChangeModal}
                />
              </Form.Group>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer
          style={{ backgroundColor: "#1E2A26", borderTop: "1px solid #1aaf4b" }}
        >
          <Button variant="secondary" onClick={cerrarModal}>
            Cancelar
          </Button>
          <Button
            variant="success"
            style={{ backgroundColor: "#1aaf4b", borderColor: "#1aaf4b" }}
            onClick={handleGuardarCambios}
          >
            Guardar Cambios
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
