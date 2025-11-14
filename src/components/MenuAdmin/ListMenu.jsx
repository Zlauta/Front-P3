import React, { useEffect, useState } from "react";
import { Button, Table, Spinner } from "react-bootstrap";
import { toast } from "react-toastify";
import {
  obtenerProductos,
  eliminarProducto,
} from "../../service/products.service.js";
import ModalEditMenu from "./ModalEditMenu.jsx";
import FormCreateMenu from "./FormCreateMenu.jsx";

const ListMenu = () => {
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
        toast.error("Error al cargar los menús");
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    fetchMenus();
  }, [reload]);

   const handleMenuCreated = () => {
    setReload((prev) => !prev); // 👈 dispara la recarga de la lista
  };

  const handleEdit = (menu) => {
    setSelectedMenu(menu);
    setShowModal(true);
  };

    const confirmDelete = (menu) => {
    toast.info(
      <div>
        <p className="p-2">¿Seguro que deseas eliminar <b>{menu.nombre}</b>?</p>
        <div style={{ display: "flex", justifyContent: "center", gap: "10px"}}>
          <Button
            variant="danger"
            size="sm"
            onClick={() => handleDelete(menu._id)}
          >
            Sí, eliminar
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => toast.dismiss()}
          >
            Cancelar
          </Button>
        </div>
      </div>,
      {
        position: "top-center",
        autoClose: false,
        closeOnClick: false,
        draggable: false,
        hideProgressBar: true,
      }
    );
  };

  // 🔹 Eliminar menú
  const handleDelete = async (id) => {
    toast.dismiss();
    try {
      await eliminarProducto(id);
      setMenus((prev) => prev.filter((m) => m._id !== id));
      toast.success("Menú eliminado correctamente");
    } catch (error) {
      console.error(error);
      toast.error("Error al eliminar el menú");
    }
  };

  // 🔹 Actualizar menú tras editar
  const handleUpdate = (updatedMenu) => {
    setMenus((prev) =>
      prev.map((menu) => (menu._id === updatedMenu._id ? updatedMenu : menu))
    );
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
                      onClick={() => confirmDelete(menu)}
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
          <FormCreateMenu onMenuCreated={handleMenuCreated} /> 
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

export default ListMenu;
