import { useEffect, useState } from "react";
import { Table, Button, Form, Container } from "react-bootstrap";
import Swal from "sweetalert2";
import "../../index.css";
import "../../api/clientAxios.js";
import {
  actualizarContacto,
  obtenerContactos,
  eliminarContacto,
} from "../../service/contacto.service.js";

function formatearFecha(iso) {
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso ?? "";
  }
}

export default function TablaContactos() {
  const [contactos, setContatos] = useState([]);
  const [ediciones, setEdiciones] = useState({});


  const cargar = async () => {
    try {
      const data = await obtenerContactos();
      setContatos(data);
    } catch (error) {
      console.error("Error al cargar contactos:", error);
    }
  };

  useEffect(() => {
    cargar();
    const enAlmacenamiento = (evento) => {
      if (evento.key === "contactos") cargar();
    };
    window.addEventListener("storage", enAlmacenamiento);
    return () => window.removeEventListener("storage", enAlmacenamiento);
  }, []);


  const manejarEstado = (id, valor) => {
    setEdiciones((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        estado: valor,
      },
    }));
  };

  const guardarCambios = async (id) => {
    const cambios = ediciones[id];
    if (!cambios) return;

    try {
      await actualizarContacto(id, cambios);
      await cargar();
      setEdiciones((prev) => {
        const copia = { ...prev };
        delete copia[id];
        return copia;
      });

      Swal.fire({
        title: "Contacto actualizado!",
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
      console.error("Error al guardar actualizar contacto:", error);
      Swal.fire({
        title: "Error al actualizar contacto",
        icon: "error",
        confirmButtonColor: "#1aaf4b ",
      });
    }
  };

  const manejarEliminar = async (id) => {
    const result = await Swal.fire({
      title: "¿Confirma que quiere eliminar este contacto?",
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
      await eliminarContacto(id);
      await cargar();

      Swal.fire({
        title: "Contacto eliminado",
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
      console.error("Error al eliminar contacto:", error);
      Swal.fire({
        title: "Error al eliminar contacto",
        icon: "error",
        confirmButtonColor: "#1aaf4b ",
      });
    }
  };

  return (
    <div className="p-1">
      <h3 className="text-light fs-1 mt-5 mb-5">Contactos recibidos</h3>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th className="tabla"> #</th>
            <th className="tabla">Nombre</th>
            <th className="tabla">Email</th>
            <th className="tabla">Telefono</th>
            <th className="tabla">Mensaje</th>
            <th className="tabla">Estado</th>
            <th className="tabla">Fecha </th>
            <th className="tabla">Accion </th>
          </tr>
        </thead>
        <tbody style={{ background: "#1E2A26 " }}>
          {contactos.length ? (
            contactos.map((contacto, idx) => (
              <tr key={contacto._id}>
                <td className="tabla">{idx + 1}</td>
                <td className="tabla">{contacto.nombre}</td>
                <td className="tabla">{contacto.email}</td>
                <td className="tabla">{contacto.telefono}</td>
                <td className="tabla">{contacto.mensaje}</td>

                <td className="tabla">
                  <Form.Select
                    value={ediciones[contacto._id]?.estado ?? contacto.estado}
                    onChange={(e) =>
                      manejarEstado(contacto._id, e.target.value)
                    }
                  >
                    <option value="pendiente">pendiente</option>
                    <option value="resuelto">resuelto</option>
                  </Form.Select>
                </td>

                <td className="tabla">{formatearFecha(contacto.createdAt)}</td>
                <td className="tabla d-flex flex-column gap-2">
                  <Button
                    className="btn-tabla"
                    size="sm"
                    variant="secondary"
                    onClick={() => guardarCambios(contacto._id)}
                    disabled={!ediciones[contacto._id]}
                  >
                    Guardar
                  </Button>
                  <Button
                    className="btn-tabla btn-eliminar"
                    size="sm"
                    variant="success"
                    onClick={() => manejarEliminar(contacto._id)}
                  >
                    Eliminar
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={8} className="text-center py-4">
                No hay contactos registrados aún.
              </td>
            </tr>
          )}
        </tbody>
      </Table>
      <div className="text-light fs-5">
        Total: {contactos.length} contacto{contactos.length === 1 ? "" : "s"}
      </div>
    </div>
  );
}
