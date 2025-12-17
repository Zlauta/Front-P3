import { useEffect, useState } from 'react';
import { Button, ButtonGroup } from 'react-bootstrap';
import { FaList, FaTable } from 'react-icons/fa'; // Iconos para el Switch
import Swal from 'sweetalert2';
import '@/index.css';
import ConfirmModal from '@/components/ui/ConfirmModal.jsx';
import {
  obtenerPedidos,
  actualizarEstadoPedido,
  eliminarPedido,
} from '@/service/pedidos.service.js';
import PedidosGrid from '@/components/adminPedido/PedidosGrid.jsx';
import PedidosTabla from '@/components/adminPedido/PedidosTabla.jsx';
import { FiGrid } from 'react-icons/fi';

export default function Pedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [ediciones, setEdiciones] = useState({});
  const [vista, setVista] = useState('grid'); // Estado del Switch: 'grid' o 'table'
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmTarget, setConfirmTarget] = useState({ id: null });

  // --- LOGICA DE DATOS ---
  const cargar = async () => {
    try {
      const data = await obtenerPedidos();
      setPedidos(data);
    } catch (error) {
      console.error('Error al cargar pedidos:', error);
    }
  };

  useEffect(() => {
    cargar();
  }, []);

  // --- LOGICA DE EDICION ---
  const manejarEstado = (id, valor) => {
    setEdiciones((prev) => ({
      ...prev,
      [id]: { ...prev[id], estado: valor },
    }));
  };

  const guardarCambios = async (id) => {
    const cambios = ediciones[id];
    if (!cambios) return;

    try {
      await actualizarEstadoPedido(id, cambios.estado);
      await cargar();

      setEdiciones((prev) => {
        const copia = { ...prev };
        delete copia[id];
        return copia;
      });

      Swal.fire({
        title: 'Pedido actualizado',
        icon: 'success',
        iconColor: '#1aaf4b',
        confirmButtonColor: '#1aaf4b',
        timer: 1200,
        showConfirmButton: false,
        customClass: { popup: 'small-alert' },
      });
    } catch (error) {
      console.error('Error:', error);
      Swal.fire({ title: 'Error al actualizar', icon: 'error', confirmButtonColor: '#1aaf4b' });
    }
  };

  // --- LOGICA DE ELIMINACION ---
  const confirmarEliminacion = (id) => {
    setConfirmTarget({ id });
    setShowConfirm(true);
  };

  const ejecutarEliminacion = async () => {
    setShowConfirm(false);
    try {
      await eliminarPedido(confirmTarget.id);
      await cargar();
      Swal.fire({
        title: 'Pedido eliminado',
        icon: 'success',
        iconColor: '#1aaf4b',
        confirmButtonColor: '#1aaf4b',
        timer: 1200,
        showConfirmButton: false,
        customClass: { popup: 'small-alert' },
      });
    } catch (error) {
      Swal.fire({ title: 'Error al eliminar', icon: 'error', confirmButtonColor: '#1aaf4b' });
    }
  };

  // Props comunes para pasar a los hijos
  const commonProps = {
    pedidos,
    ediciones,
    onEstadoChange: manejarEstado,
    onGuardar: guardarCambios,
    onEliminar: confirmarEliminacion,
  };

  return (
    <div className="p-4">
      {/* Header con Titulo y Switch */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-5 mt-4">
        <h3 className="text-light fs-1 m-0">Gestión de Pedidos</h3>

        <div className="d-flex gap-3 align-items-center mt-3 mt-md-0">
          <ButtonGroup>
            <Button
              variant={vista === 'grid' ? 'success' : 'outline-secondary'}
              onClick={() => setVista('grid')}
              title="Vista de Tarjetas"
            >
              <FiGrid />
            </Button>
            <Button
              variant={vista === 'table' ? 'success' : 'outline-secondary'}
              onClick={() => setVista('table')}
              title="Vista de Lista"
            >
              <FaTable />
            </Button>
          </ButtonGroup>
        </div>
      </div>

      {/* Renderizado Condicional */}
      {pedidos.length === 0 ? (
        <div className="text-center text-light py-5 border rounded bg-dark">
          <h4>No hay pedidos registrados.</h4>
        </div>
      ) : vista === 'grid' ? (
        <PedidosGrid {...commonProps} />
      ) : (
        <PedidosTabla {...commonProps} />
      )}

      <div className="text-light fs-5 mt-4 text-end">
        Total: {pedidos.length} pedido{pedidos.length === 1 ? '' : 's'}
      </div>

      <ConfirmModal
        show={showConfirm}
        title={`¿Eliminar pedido?`}
        text={`Esta acción no se puede deshacer.`}
        onConfirm={ejecutarEliminacion}
        onCancel={() => setShowConfirm(false)}
        confirmText="Sí, eliminar"
        cancelText="Cancelar"
      />
    </div>
  );
}
