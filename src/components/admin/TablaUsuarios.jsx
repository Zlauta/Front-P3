import { useEffect, useState } from "react";
import { Table, Button, Form } from "react-bootstrap";
import Swal from "sweetalert2";
import "./TablaUsuarios.css";
import {
  obtenerUsuariosDeLocalStorage,
  guardarEnLocalStorage,
} from "../../utils/localStorage.users";

function formatearFecha(iso) {
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso ?? "";
  }
}

export default function TablaUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [ediciones, setEdiciones] = useState({});

  const cargar = () => setUsuarios(obtenerUsuariosDeLocalStorage());

  useEffect(() => {
    cargar();
    const enAlmacenamiento = (evento) => {
      if (evento.key === "usuarios") cargar();
    };
    window.addEventListener("storage", enAlmacenamiento);
    return () => window.removeEventListener("storage", enAlmacenamiento);
  }, []);

  const manejarCambio = (id, valor) => {
    setEdiciones((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        rol: valor,
      },
    }));
  };

  const guardarCambios = (id) => {
    const cambios = ediciones[id];
    if (!cambios) return;

    const actualizados = usuarios.map((u) =>
      u.id === id ? { ...u, ...cambios } : u
    );

    guardarEnLocalStorage(actualizados);
    setUsuarios(actualizados);

    setEdiciones((prev) => {
      const copia = { ...prev };
      delete copia[id];
      return copia;
    });

    Swal.fire({
      title: "Cambios guardados",
      icon: "success",
      iconColor: "#1aaf4b ",
      confirmButtonColor: "#1aaf4b ",
      timer: 1200,
      showConfirmButton: false,
      customClass: {
        popup: "small-alert",
      },
    });
  };

  return (
    <div className="p-1">
      <h3 className="text-light fs-1 mt-5 mb-5">Usuarios registrados</h3>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>#</th>
            <th>Nombre</th>
            <th>Email</th>
            <th>Rol</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.length ? (
            usuarios.map((usuario, idx) => (
              <tr key={usuario.id}>
                <td>{idx + 1}</td>
                <td>{usuario.nombreUsuario}</td>
                <td>{usuario.email}</td>

                <td>
                  <Form.Select
                    value={ediciones[usuario.id]?.rol ?? usuario.rol}
                    onChange={(e) => manejarCambio(usuario.id, e.target.value)}
                  >
                    <option value="administrador">administrador</option>
                    <option value="cliente">cliente</option>
                  </Form.Select>
                </td>
                <td>{formatearFecha(usuario.createdAt)}</td>
                <td className="d-flex flex-column gap-2">
                  <Button
                    className="btn-tabla"
                    size="sm"
                    variant="secondary"
                    onClick={() => guardarCambios(usuario.id)}
                    disabled={!ediciones[usuario.id]}
                  >
                    Guardar cambios
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={7} className="text-center py-4">
                No hay usuarios registrados aún.
              </td>
            </tr>
          )}
        </tbody>
      </Table>
      <div className="text-light fs-5">
        Total: {usuarios.length} usuario{usuarios.length === 1 ? "" : "s"}
      </div>
    </div>
  );
}
