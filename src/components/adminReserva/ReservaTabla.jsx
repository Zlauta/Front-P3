import { Table, Button } from "react-bootstrap";
import { FaEdit, FaTrash } from 'react-icons/fa';

export default function ReservasTabla({ reservas, onEditar, onEliminar }) {
  
  const formatearFecha = (isoString) => {
    return isoString ? new Date(isoString).toLocaleDateString("es-ES", { timeZone: "UTC" }) : "";
  };

  return (
    <Table striped bordered hover responsive variant="dark" style={{ verticalAlign: 'middle' }}>
      <thead>
        <tr>
          {['Usuario', 'Mesa', 'Personas', 'Fecha', 'Hora', 'Notas', 'Acciones'].map((t) => (
             <th key={t} className="bg-success text-white">{t}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {reservas.map((r) => (
          <tr key={r._id}>
            <td>{r.usuario?.email || 'N/A'}</td>
            <td>{r.mesa}</td>
            <td>{r.cantidadPersonas}</td>
            <td>{formatearFecha(r.fecha)}</td>
            <td>{r.hora}</td>
            <td>{r.notas || "-"}</td>
            <td className="text-center">
              <Button size="sm" variant="secondary" className="me-2" onClick={() => onEditar(r)}>
                <FaEdit/>
              </Button>
              <Button size="sm" variant="danger" onClick={() => onEliminar(r._id)}>
                <FaTrash/>
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}