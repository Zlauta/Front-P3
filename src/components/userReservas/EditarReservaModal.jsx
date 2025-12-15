import { useEffect, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";

export default function EditarReservaModal({ show, onHide, reserva, onGuardar }) {
  // Estado local para manejar el formulario mientras se edita
  const [datos, setDatos] = useState(reserva || {});
  const [horaMinima, setHoraMinima] = useState("");

  // Actualizar datos locales cuando cambia la reserva seleccionada
  useEffect(() => {
    if (reserva) {
        // Formatear fecha para el input type="date"
        const fechaInput = new Date(reserva.fecha).toISOString().split("T")[0];
        setDatos({ ...reserva, fecha: fechaInput });
    }
  }, [reserva]);

  // Calcular hora mínima si es HOY
  useEffect(() => {
    if (!datos.fecha) return;
    const fechaInput = new Date(datos.fecha + "T00:00:00");
    const esHoy = fechaInput.toDateString() === new Date().toDateString();
    setHoraMinima(esHoy ? new Date().toTimeString().slice(0, 5) : "");
  }, [datos.fecha]);

  const handleChange = (e) => {
    setDatos({ ...datos, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    onGuardar(datos); // Enviamos los datos al padre
  };

  const camposFormulario = [
    { label: "Mesa", name: "mesa", type: "number" },
    { label: "Cantidad Personas", name: "cantidadPersonas", type: "number" },
    { label: "Fecha", name: "fecha", type: "date" },
    { label: "Hora", name: "hora", type: "time", min: horaMinima },
  ];

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton className="bg-dark text-white border-success">
        <Modal.Title>Modificar mi Reserva</Modal.Title>
      </Modal.Header>
      <Modal.Body className="bg-dark text-white">
        <Form>
          {camposFormulario.map((campo) => (
            <Form.Group className="mb-3" key={campo.name}>
              <Form.Label>{campo.label}</Form.Label>
              <Form.Control
                type={campo.type}
                min={campo.min}
                name={campo.name}
                value={datos[campo.name] || ""}
                onChange={handleChange}
              />
            </Form.Group>
          ))}
          <Form.Group className="mb-3">
            <Form.Label>Notas especiales</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              name="notas"
              value={datos.notas || ""}
              onChange={handleChange}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer className="bg-dark border-success">
        <Button variant="secondary" onClick={onHide}>Cerrar</Button>
        <Button variant="success" onClick={handleSubmit}>Confirmar Cambios</Button>
      </Modal.Footer>
    </Modal>
  );
}