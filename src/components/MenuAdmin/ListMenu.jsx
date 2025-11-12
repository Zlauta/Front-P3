import React, { useEffect, useState } from "react";
import { Button, Table, Spinner } from "react-bootstrap";
import { toast } from "react-toastify";
import {
  obtenerProductos,
  eliminarProducto,
} from "../../service/products.service.js";
import ModalEditMenu from "./ModalEditMenu.jsx";

const ListMenu = () => {
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMenu, setSelectedMenu] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // 🔹 Cargar los menús al montar el componente
  useEffect(() => {
    const fetchMenus = async () => {
      try {
        const data = await obtenerProductos();
        console.log("🧠 Menús recibidos:", data);
        setMenus(data || []);
      } catch (error) {
        console.error(error);
        toast.error("Error al cargar los menús");
      } finally {
        setLoading(false);
      }
    };
    fetchMenus();
  }, []);

  // 🔹 Abrir modal de edición
  const handleEdit = (menu) => {
    setSelectedMenu(menu);
    setShowModal(true);
  };

  // 🔹 Eliminar menú
  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este menú?")) return;

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
          <thead >
            <tr >
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
                      style={{ width: "70px", height: "70px", borderRadius: "8px" }}
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
                      className="me-2"
                      onClick={() => handleEdit(menu)}
                    >
                      Editar
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete(menu._id)}
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

        {showModal && (
          <ModalEditMenu
            show={showModal}
            handleClose={() => setShowModal(false)}
            menu={selectedMenu}
            onUpdate={handleUpdate}
          />
        )}
      </div>
    </div>
  );
};

export default ListMenu;