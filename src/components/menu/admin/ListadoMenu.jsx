import React, { useEffect, useState } from 'react';
import { Button, Spinner, ButtonGroup, Form, InputGroup, Card, Row, Col } from 'react-bootstrap';
import { FaSearch, FaTable } from 'react-icons/fa'; // Asegúrate de tener react-icons
import Swal from 'sweetalert2';
import ConfirmModal from '@/components/ui/ConfirmModal.jsx';
import { obtenerProductos, eliminarProducto } from '@/service/producto.service.js';
import ModalEditMenu from './EditarMenuModal.jsx';
import FormularioCrearMenu from './FormularioCrearMenu.jsx';
import MenuTabla from './MenuTabla.jsx';
import MenuGrid from './MenuGrid.jsx';
import { FiGrid } from 'react-icons/fi';

const ListadoMenu = () => {
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMenu, setSelectedMenu] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [reload, setReload] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmTarget, setConfirmTarget] = useState({ id: null, nombre: '' });

  // ESTADOS NUEVOS (Filtros y Vista)
  const [vista, setVista] = useState('grid');
  const [busqueda, setBusqueda] = useState('');
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('Todas');

  const fetchMenus = async () => {
    try {
      const data = await obtenerProductos();
      setMenus(data || []);
    } catch (error) {
      console.error(error);
      Swal.fire({ icon: 'error', title: 'Error', text: 'Hubo un problema al cargar los menús' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenus();
  }, [reload]);

  // --- LÓGICA DE FILTRADO (Magic happen here) ---
  const menusFiltrados = menus.filter((menu) => {
    const matchCategoria =
      categoriaSeleccionada === 'Todas' || menu.categoria === categoriaSeleccionada;
    const matchBusqueda = menu.nombre.toLowerCase().includes(busqueda.toLowerCase());
    return matchCategoria && matchBusqueda;
  });

  // Extraer categorías únicas para los botones
  const categorias = ['Todas', ...new Set(menus.map((m) => m.categoria))];

  // --- HANDLERS ---
  const handleMenuCreated = () => {
    setReload((prev) => !prev);
    Swal.fire({
      icon: 'success',
      title: 'Creado',
      text: 'El menú se creó correctamente',
      timer: 2000,
      showConfirmButton: false,
    });
  };

  const handleEdit = (menu) => {
    setSelectedMenu(menu);
    setShowModal(true);
  };

  const handleDelete = (id, nombre) => {
    setConfirmTarget({ id, nombre });
    setShowConfirm(true);
  };

  const handleConfirmDelete = async () => {
    const { id } = confirmTarget;
    setShowConfirm(false);
    try {
      await eliminarProducto(id);
      setMenus((prev) => prev.filter((m) => m._id !== id));
      Swal.fire({
        icon: 'success',
        title: 'Eliminado',
        text: 'El menú ha sido eliminado.',
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error(error);
      Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo eliminar el menú.' });
    }
  };

  const handleUpdate = (updatedMenu) => {
    setMenus((prev) => prev.map((menu) => (menu._id === updatedMenu._id ? updatedMenu : menu)));
    Swal.fire({
      icon: 'success',
      title: 'Actualizado',
      text: 'Menú actualizado con éxito',
      timer: 1500,
      showConfirmButton: false,
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
    <div style={{ backgroundColor: '#122117', minHeight: '100vh', padding: '40px 0' }}>
      <div className="container">
        <h2 style={{ color: '#ffffff', textAlign: 'center', marginBottom: '2rem' }}>
          Listado de Menús
        </h2>

        {/* BARRA DE HERRAMIENTAS (Buscador + Categorías + Switch) */}
        <Card className="bg-dark border-secondary mb-4 p-3 shadow-sm">
          <Row className="g-3 align-items-center">
            {/* 1. Buscador */}
            <Col xs={12} md={4}>
              <InputGroup>
                <InputGroup.Text className="bg-secondary border-secondary text-white">
                  <FaSearch />
                </InputGroup.Text>
                <Form.Control
                  placeholder="Buscar plato..."
                  className="bg-dark text-white border-secondary"
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                />
              </InputGroup>
            </Col>

            {/* 2. Categorías */}
            <Col xs={12} md={6}>
              <div className="d-flex gap-2 overflow-auto pb-2" style={{ scrollbarWidth: 'thin' }}>
                {categorias.map((cat) => (
                  <Button
                    key={cat}
                    variant={categoriaSeleccionada === cat ? 'success' : 'outline-secondary'}
                    size="sm"
                    onClick={() => setCategoriaSeleccionada(cat)}
                    className="rounded-pill px-3 text-nowrap"
                  >
                    {cat}
                  </Button>
                ))}
              </div>
            </Col>

            {/* 3. Switch Vista */}
            <Col xs={12} md={2} className="text-md-end">
              <ButtonGroup>
                <Button
                  variant={vista === 'grid' ? 'success' : 'outline-secondary'}
                  onClick={() => setVista('grid')}
                >
                  <FiGrid />
                </Button>
                <Button
                  variant={vista === 'table' ? 'success' : 'outline-secondary'}
                  onClick={() => setVista('table')}
                >
                <FaTable />
                </Button>
              </ButtonGroup>
            </Col>
          </Row>
        </Card>

        {/* CONTENIDO PRINCIPAL */}
        {menusFiltrados.length === 0 ? (
          <div className="text-center text-white-50 py-5 bg-dark rounded border border-secondary mb-4">
            <h4>No se encontraron menús con estos filtros.</h4>
          </div>
        ) : vista === 'table' ? (
          <MenuTabla menus={menusFiltrados} onEdit={handleEdit} onDelete={handleDelete} />
        ) : (
          <MenuGrid menus={menusFiltrados} onEdit={handleEdit} onDelete={handleDelete} />
        )}

        <div className="text-white-50 mt-2 mb-5 text-end small">
          Mostrando {menusFiltrados.length} de {menus.length} menús
        </div>

        {/* FORMULARIO DE CREACIÓN */}
        <div className="mb-5 pt-4 border-top border-secondary">
          <h4 className="text-white mb-4">Agregar Nuevo Menú</h4>
          <FormularioCrearMenu onMenuCreated={handleMenuCreated} />
        </div>

        {/* MODALES */}
        {showModal && (
          <ModalEditMenu
            show={showModal}
            onHide={() => setShowModal(false)}
            menu={selectedMenu}
            onUpdated={handleUpdate}
          />
        )}

        <ConfirmModal
          show={showConfirm}
          title={`¿Eliminar ${confirmTarget.nombre}?`}
          text={`No podrás revertir esta acción.`}
          onConfirm={handleConfirmDelete}
          onCancel={() => setShowConfirm(false)}
          confirmText="Sí, eliminar"
          cancelText="Cancelar"
        />
      </div>
    </div>
  );
};

export default ListadoMenu;
