import { Table, Button } from "react-bootstrap";
import { FaEdit, FaTrash } from "react-icons/fa";
import { formatearFecha } from "@/utils/reservasUtil.js";

export default function ReservasTabla({ reservas, onEditar, onEliminar }) {
  return (
    <Table striped bordered hover responsive variant="dark" style={{ verticalAlign: "middle" }}>
      <thead>
        <tr>
          <th className="bg-success text-white">Usuario</th>
          <th className="bg-success text-white">Mesa</th>
          <th className="bg-success text-white">Personas</th>
          <th className="bg-success text-white">Fecha</th>
          <th className="bg-success text-white">Hora</th>
          <th className="bg-success text-white">Notas</th>
          <th className="bg-success text-white text-center">Acciones</th>
        </tr>
      </thead>
      <tbody>
        {reservas.map((reserva) => (
          <tr key={reserva._id}>
            <td>{reserva.usuario?.email || "Usuario eliminado"}</td>
            <td>{reserva.mesa}</td>
            <td>{reserva.cantidadPersonas}</td>
            <td>{formatearFecha(reserva.fecha)}</td>
            <td>{reserva.hora}</td>
            <td>{reserva.notas || "-"}</td>
            <td className="text-center">
              <Button size="sm" variant="secondary" className="me-2" onClick={() => onEditar(reserva)}>
                <FaEdit />
              </Button>
              <Button size="sm" variant="danger" onClick={() => onEliminar(reserva._id)}>
                <FaTrash />
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}