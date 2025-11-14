import { useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

export default function ReservasAdmin() {
  const [reservas, setReservas] = useState([]);
  const [editReserva, setEditReserva] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // -------------------------------
  // Cargar datos (simulación)
  // -------------------------------
  useEffect(() => {
    // Aquí después haces fetch("tu-api/reservas")
    setReservas([
      {
        id: 1,
        nombre: "Leonel",
        mesa: 3,
        cantidadPersonas: 4,
        fecha: "2025-11-10",
        hora: "20:30",
        notas: "Ventana",
      },
      {
        id: 2,
        nombre: "Maria",
        mesa: 1,
        cantidadPersonas: 2,
        fecha: "2025-11-11",
        hora: "21:00",
        notas: "",
      },
    ]);
  }, []);

  // -------------------------------
  // Eliminar reserva
  // -------------------------------
  const handleDelete = (id) => {
    if (!confirm("¿Seguro que deseas eliminar esta reserva?")) return;

    setReservas(reservas.filter((r) => r.id !== id));

    // Aquí iría tu DELETE:
    // await fetch(`/api/reservas/${id}`, { method: "DELETE" });
  };

  // -------------------------------
  // Abrir modal de edición
  // -------------------------------
  const openEdit = (reserva) => {
    setEditReserva(reserva);
    setShowModal(true);
  };

  // -------------------------------
  // Guardar cambios
  // -------------------------------
  const handleSave = () => {
    setReservas(
      reservas.map((r) => (r.id === editReserva.id ? editReserva : r))
    );

    // Aquí tu PUT:
    // await fetch(`/api/reservas/${id}`, { method: "PUT", body: JSON.stringify(editReserva) });

    setShowModal(false);
  };

  return (
    <div className="container py-4">
      <h2 className="mb-4">Administrador – Reservas</h2>

      {/* TABLA */}
      <div className="table-responsive">
        <table className="table table-dark table-striped table-hover text-center align-middle">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Mesa</th>
              <th>Personas</th>
              <th>Fecha</th>
              <th>Hora</th>
              <th>Notas</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {reservas.map((res) => (
              <tr key={res.id}>
                <td>{res.id}</td>
                <td>{res.nombre}</td>
                <td>{res.mesa}</td>
                <td>{res.cantidadPersonas}</td>
                <td>{res.fecha}</td>
                <td>{res.hora}</td>
                <td>{res.notas || "-"}</td>
                <td>
                  <Button
                    variant="warning"
                    size="sm"
                    className="me-2"
                    onClick={() => openEdit(res)}
                  >
                    Editar
                  </Button>

                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(res.id)}
                  >
                    Eliminar
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL DE EDICIÓN */}
      {editReserva && (
        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Editar Reserva</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <div className="mb-3">
              <label>Nombre</label>
              <input
                type="text"
                className="form-control"
                value={editReserva.nombre}
                onChange={(e) =>
                  setEditReserva({ ...editReserva, nombre: e.target.value })
                }
              />
            </div>

            <div className="mb-3">
              <label>Mesa</label>
              <input
                type="number"
                className="form-control"
                value={editReserva.mesa}
                onChange={(e) =>
                  setEditReserva({ ...editReserva, mesa: e.target.value })
                }
              />
            </div>

            <div className="mb-3">
              <label>Cantidad de Personas</label>
              <input
                type="number"
                className="form-control"
                value={editReserva.cantidadPersonas}
                onChange={(e) =>
                  setEditReserva({
                    ...editReserva,
                    cantidadPersonas: e.target.value,
                  })
                }
              />
            </div>

            <div className="mb-3">
              <label>Fecha</label>
              <input
                type="date"
                className="form-control"
                value={editReserva.fecha}
                onChange={(e) =>
                  setEditReserva({ ...editReserva, fecha: e.target.value })
                }
              />
            </div>

            <div className="mb-3">
              <label>Hora</label>
              <input
                type="time"
                className="form-control"
                value={editReserva.hora}
                onChange={(e) =>
                  setEditReserva({ ...editReserva, hora: e.target.value })
                }
              />
            </div>

            <div className="mb-3">
              <label>Notas</label>
              <textarea
                className="form-control"
                rows="3"
                value={editReserva.notas}
                onChange={(e) =>
                  setEditReserva({ ...editReserva, notas: e.target.value })
                }
              ></textarea>
            </div>
          </Modal.Body>

          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancelar
            </Button>
            <Button variant="primary" onClick={handleSave}>
              Guardar Cambios
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
}
