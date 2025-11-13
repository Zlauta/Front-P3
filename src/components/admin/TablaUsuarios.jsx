import { useEffect, useState } from "react";
import { Table, Button, Form } from "react-bootstrap";
import Swal from "sweetalert2";
import "./TablaUsuarios.css";
import "../../api/clientAxios.js";
import {
  actualizarUsuario,
  obtenerUsuarios,
  eliminarUsuario,
} from "../../service/users.service.js";

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

  const cargar = async () => {
    try {
      const data = await obtenerUsuarios();
      setUsuarios(data);
    } catch (error) {
      console.error("Error al cargar usuarios:", error);
    }
  };

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

  const guardarCambios = async (id) => {
    const cambios = ediciones[id];
    if (!cambios) return;

    try {
      await actualizarUsuario(id, cambios);
      await cargar();
      setEdiciones((prev) => {
        const copia = { ...prev };
        delete copia[id];
        return copia;
      });

      Swal.fire({
        title: "Rol de usuario, actualizado!",
        icon: "success",
        iconColor: "#1aaf4b ",
        confirmButtonColor: "#1aaf4b ",
        timer: 1200,
        showConfirmButton: false,
        customClass: {
          popup: "small-alert",
        },
      });
    } catch (error) {
      console.error("Error al guardar actualizar rol de usuario:", error);
      Swal.fire({
        title: "Error al actualizar nuevo rol de usuario",
        icon: "error",
        confirmButtonColor: "#1aaf4b ",
      });
    }
  };

  const manejarEliminar = async (id) => {
    const result = await Swal.fire({
      title: "¿Confirma que quiere eliminar este usuario?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#1aaf4b",
      cancelButtonColor: "#042d12ff",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (!result.isConfirmed) {
      return;
    }

    try {
      await eliminarUsuario(id);
      await cargar();

      Swal.fire({
        title: "Usuario eliminado",
        icon: "success",
        iconColor: "#1aaf4b ",
        confirmButtonColor: "#1aaf4b ",
        timer: 1200,
        showConfirmButton: false,
        customClass: {
          popup: "small-alert",
        },
      });
    } catch (error) {
      console.error("Error al eliminar usuario:", error);
      Swal.fire({
        title: "Error al eliminar usuario",
        icon: "error",
        confirmButtonColor: "#1aaf4b ",
      });
    }
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
            <th>Telefono</th>
            <th>Rol</th>
            <th>Fecha Reg</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.length ? (
            usuarios.map((usuario, idx) => (
              <tr key={usuario._id}>
                <td>{idx + 1}</td>
                <td>{usuario.nombre}</td>
                <td>{usuario.email}</td>
                <td>{usuario.telefono}</td>
                <td>
                  <Form.Select
                    value={ediciones[usuario._id]?.rol ?? usuario.rol}
                    onChange={(e) => manejarCambio(usuario._id, e.target.value)}
                  >
                    <option value="admin">administrador</option>
                    <option value="cliente">cliente</option>
                  </Form.Select>
                </td>
                <td>{formatearFecha(usuario.createdAt)}</td>
                <td className="d-flex flex-column gap-2">
                  <Button
                    className="btn-tabla"
                    size="sm"
                    variant="secondary"
                    onClick={() => guardarCambios(usuario._id)}
                    disabled={!ediciones[usuario._id]}
                  >
                    Cambiar Rol
                  </Button>
                  <Button
                    className="btn-tabla btn-eliminar"
                    size="sm"
                    variant="danger"
                    onClick={() => manejarEliminar(usuario._id)}
                  >
                    Eliminar
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
