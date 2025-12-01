import React, { useEffect, useState } from "react";
import { Button, Table, Spinner } from "react-bootstrap";
import Swal from "sweetalert2";
import {
  obtenerProductos,
  eliminarProducto,
} from "../../../service/producto.service.js";
import ModalEditMenu from "./EditarMenuModal.jsx";
import FormularioCrearMenu from "./FormularioCrearMenu.jsx";

const ListadoMenu = () => {
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMenu, setSelectedMenu] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [reload, setReload] = useState(false);

  const fetchMenus = async () => {
    try {
      const data = await obtenerProductos();
      setMenus(data || []);
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Hubo un problema al cargar los menús",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenus();
  }, [reload]);

  const handleMenuCreated = () => {
    setReload((prev) => !prev);
    Swal.fire({
      icon: "success",
      title: "Creado",
      text: "El menú se creó correctamente",
      timer: 2000,
      showConfirmButton: false,
    });
  };

  const handleEdit = (menu) => {
    setSelectedMenu(menu);
    setShowModal(true);
  };

  const handleDelete = (id, nombre) => {
    Swal.fire({
      title: `¿Estás seguro de eliminar "${nombre}"?`,
      text: "No podrás revertir esta acción",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await eliminarProducto(id);
          setMenus((prev) => prev.filter((m) => m._id !== id));
          
          Swal.fire({
            icon: "success",
            title: "Eliminado",
            text: "El menú ha sido eliminado.",
            timer: 2000,
            showConfirmButton: false,
          });
        } catch (error) {
          console.error(error);
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "No se pudo eliminar el menú.",
          });
        }
      }
    });
  };

  const handleUpdate = (updatedMenu) => {
    setMenus((prev) =>
      prev.map((menu) => (menu._id === updatedMenu._id ? updatedMenu : menu))
    );
    Swal.fire({
        icon: "success",
        title: "Actualizado",
        text: "Menú actualizado con éxito",
        timer: 1500,
        showConfirmButton: false
    });
  };

  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" variant="success" />
        <p className="text-white mt-3">Cargando menús...</p>
      </div>
    );
  }

  return (
    <div
      style={{
        backgroundColor: "#122117",
        minHeight: "100vh",
        padding: "40px 0",
      }}
    >
      <div className="container">
        <h2
          style={{
            color: "#ffffff",
            textAlign: "center",
            marginBottom: "2rem",
          }}
        >
          Listado de Menús
        </h2>

        <Table
          striped
          bordered
          responsive
          style={{ borderRadius: "12px", overflow: "hidden" }}
        >
          <thead>
            <tr>
              <th className="tabla">Imagen</th>
              <th className="tabla">Nombre</th>
              <th className="tabla">Descripción</th>
              <th className="tabla">Precio</th>
              <th className="tabla">Categoría</th>
              <th className="tabla">Acciones</th>
            </tr>
          </thead>
          <tbody style={{ background: "#1E2A26 " }}>
            {menus.length > 0 ? (
              menus.map((menu) => (
                <tr key={menu._id}>
                  <td className="tabla">
                    <img
                      src={menu.imagen || "/placeholder.png"}
                      alt={menu.nombre}
                      style={{
                        width: "70px",
                        height: "70px",
                        borderRadius: "8px",
                        objectFit: "cover",
                      }}
                    />
                  </td>
                  <td className="tabla">{menu.nombre}</td>
                  <td className="tabla">{menu.descripcion}</td>
                  <td className="tabla">${menu.precio}</td>
                  <td className="tabla">{menu.categoria}</td>
                  <td className="text-center tabla">
                    <Button
                      variant="success"
                      size="sm"
                      className="m-2"
                      onClick={() => handleEdit(menu)}
                    >
                      Editar
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete(menu._id, menu.nombre)}
                    >
                      Eliminar
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center text-muted tabla">
                  No hay menús cargados aún.
                </td>
              </tr>
            )}
          </tbody>
        </Table>

        <div className="mb-5">
          <FormularioCrearMenu onMenuCreated={handleMenuCreated} />
        </div>

        {showModal && (
          <ModalEditMenu
            show={showModal}
            onHide={() => setShowModal(false)}
            menu={selectedMenu}
            onUpdated={handleUpdate}
          />
        )}
      </div>
    </div>
  );
};

export default ListadoMenu;