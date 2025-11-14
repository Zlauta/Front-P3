import { useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

export default function ReservasAdmin() {
  const [reservas, setReservas] = useState([]);
  const [editReserva, setEditReserva] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // ===========================================
  // CARGAR RESERVAS DESDE EL BACKEND
  // ===========================================
  useEffect(() => {
    const fetchReservas = async () => {
      const res = await fetch("http://localhost:3000/api/reservas");
      const data = await res.json();
      setReservas(data);
    };

    fetchReservas();
  }, []);

  // ===========================================
  // ELIMINAR RESERVA
  // ===========================================
  const handleDelete = async (_id) => {
    if (!confirm("¿Seguro que deseas eliminar esta reserva?")) return;

    try {
      const res = await fetch(`http://localhost:3000/api/reservas/${_id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "No se pudo eliminar la reserva");
        return;
      }

      // 🔥 Eliminar del estado
      setReservas((prev) => prev.filter((r) => r._id !== _id));
    } catch (error) {
      console.error(error);
      alert("Error de conexión");
    }
  };

  // ===========================================
  // ABRIR MODAL CON LA RESERVA A EDITAR
  // ===========================================
  const openEdit = (reserva) => {
    setEditReserva({ ...reserva });
    setShowModal(true);
  };

  // ===========================================
  // GUARDAR CAMBIOS (PUT)
  // ===========================================
  const handleSave = async () => {
    const _id = editReserva._id;

    try {
      const res = await fetch(`http://localhost:3000/api/reservas/${_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editReserva),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "No se pudo actualizar la reserva");
        return;
      }

      // 🔥 Actualizar estado local
      setReservas((prev) => prev.map((r) => (r._id === _id ? editReserva : r)));

      setShowModal(false);
    } catch (error) {
      console.error(error);
      alert("Error al actualizar la reserva");
    }
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
              <th>Usuario</th>
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
              <tr key={res._id}>
                <td>{res._id}</td>
                <td>{res.usuario}</td>
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
                    onClick={() => handleDelete(res._id)}
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
              <label>Usuario</label>
              <input
                type="text"
                className="form-control"
                value={editReserva.usuario}
                onChange={(e) =>
                  setEditReserva({ ...editReserva, usuario: e.target.value })
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
              <label>Personas</label>
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
