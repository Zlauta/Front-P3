import React, { useState } from 'react';
import { Button, ListGroup, Spinner, Form, Card } from 'react-bootstrap';
import { initMercadoPago, Wallet } from '@mercadopago/sdk-react';
import Swal from 'sweetalert2';
import { crearPreferenciaPago } from '@/service/pagos.service.js';
import { FaTrashAlt } from 'react-icons/fa';
import { formatearDinero } from '@/utils/FormatearPrecio.js';

initMercadoPago(import.meta.env.VITE_MP_PUBLIC_KEY, { locale: 'es-AR' });

const CarritoDeCompras = ({
  productosEnCarrito,
  totalAPagar,
  eliminarProductoDelCarrito,
  actualizarCantidadProducto,
}) => {
  const [idPreferenciaMercadoPago, setIdPreferenciaMercadoPago] = useState(null);
  const [estaCargandoPago, setEstaCargandoPago] = useState(false);
  const [datosDelCliente, setDatosDelCliente] = useState({
    telefono: '',
    direccion: '',
  });

  const iniciarProcesoDePago = async () => {
    const telefonoValido = /^[\d\s-]{8,}$/.test(datosDelCliente.telefono);
    const direccionValida = datosDelCliente.direccion.length >= 10;

    if (!telefonoValido || !direccionValida) {
      return Swal.fire(
        'Datos incompletos',
        'Por favor ingresa un teléfono válido y una dirección detallada (mínimo 10 caracteres).',
        'warning'
      );
    }

    setEstaCargandoPago(true);

    try {
      const respuestaPago = await crearPreferenciaPago({
        items: productosEnCarrito,
        total: totalAPagar,
        direccion: datosDelCliente.direccion,
        telefono: datosDelCliente.telefono,
      });

      if (respuestaPago.id) {
        setIdPreferenciaMercadoPago(respuestaPago.id);
      }
    } catch (error) {
      Swal.fire('Error al procesar', error.message, 'error');
    } finally {
      setEstaCargandoPago(false);
    }
  };

  if (productosEnCarrito.length === 0) {
    return (
      <Card className="p-4 text-center text-muted shadow-sm border-0">
        <h5>Tu carrito está vacío</h5>
        <small>Agrega productos del menú para comenzar.</small>
      </Card>
    );
  }

  return (
    <Card className="shadow-sm border-0 bg-light" style={{ borderRadius: '16px' }}>
      <Card.Header
        className="bg-white border-bottom-0 pt-4 pb-2"
        style={{ borderTopLeftRadius: '16px', borderTopRightRadius: '16px' }}
      >
        <h4 className="text-success fw-bold m-0">Resumen de Pedido</h4>
      </Card.Header>
      <div
        style={{
          maxHeight: '48vh',
          overflowY: 'auto',
          overflowX: 'hidden',
          padding: '0 15px',
        }}
      >
        <Card.Body className="p-0">
          <ListGroup variant="flush" className="mb-4 mt-2">
            {productosEnCarrito.map((producto, indice) => (
              <ListGroup.Item
                key={indice}
                className="d-flex justify-content-between align-items-center bg-transparent px-0 py-3 border-bottom"
              >
                <div style={{ width: '40%' }}>
                  <span className="fw-bold d-block text-dark">{producto.nombre}</span>
                  <small className="text-muted">Unitario: {formatearDinero(producto.precio)}</small>
                </div>

                <div className="d-flex align-items-center gap-2">
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    className="rounded-circle p-0 d-flex align-items-center justify-content-center"
                    style={{ width: '28px', height: '28px' }}
                    onClick={() => actualizarCantidadProducto(producto._id, -1)}
                    disabled={producto.quantity <= 1}
                  >
                    -
                  </Button>

                  <span className="fw-bold mx-1">{producto.quantity}</span>

                  <Button
                    variant="outline-secondary"
                    size="sm"
                    className="rounded-circle p-0 d-flex align-items-center justify-content-center"
                    style={{ width: '28px', height: '28px' }}
                    onClick={() => actualizarCantidadProducto(producto._id, 1)}
                  >
                    +
                  </Button>
                </div>

                <div className="text-end">
                  <div className="fw-bold text-success mb-1">
                    {formatearDinero(producto.precio * producto.quantity)}
                  </div>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    className="py-0 px-2 border-0"
                    style={{ fontSize: '1rem' }}
                    onClick={() => eliminarProductoDelCarrito(indice)}
                  >
                    <FaTrashAlt />
                  </Button>
                </div>
              </ListGroup.Item>
            ))}
          </ListGroup>
          <div className="mb-4 p-3 bg-white rounded border shadow-sm">
            <h6 className="text-muted mb-3 fw-bold">Datos de Envío</h6>
            <Form.Group className="mb-3">
              <Form.Label className="small text-secondary">Teléfono de contacto</Form.Label>
              <Form.Control
                type="tel"
                placeholder="Ej: 381..."
                value={datosDelCliente.telefono}
                onChange={(e) =>
                  setDatosDelCliente({
                    ...datosDelCliente,
                    telefono: e.target.value,
                  })
                }
              />
            </Form.Group>
            <Form.Group>
              <Form.Label className="small text-secondary">Dirección de entrega</Form.Label>
              <Form.Control
                type="text"
                placeholder="Calle, número y barrio"
                value={datosDelCliente.direccion}
                onChange={(e) =>
                  setDatosDelCliente({
                    ...datosDelCliente,
                    direccion: e.target.value,
                  })
                }
              />
            </Form.Group>
          </div>
        </Card.Body>
      </div>

      <Card.Footer
        className="bg-white border-top pt-3 pb-4"
        style={{
          borderBottomLeftRadius: '16px',
          borderBottomRightRadius: '16px',
        }}
      >
        <div className="d-flex justify-content-between align-items-center mb-3">
          <span className="h5 mb-0 text-muted">Total:</span>
          <span className="h4 mb-0 fw-bold text-success">{formatearDinero(totalAPagar)}</span>
        </div>

        {estaCargandoPago ? (
          <div className="text-center py-2">
            <Spinner animation="border" variant="success" size="sm" />
            <span className="ms-2 small">Preparando pago...</span>
          </div>
        ) : idPreferenciaMercadoPago ? (
          <Wallet initialization={{ preferenceId: idPreferenciaMercadoPago }} />
        ) : (
          <Button
            variant="success"
            size="lg"
            className="w-100 fw-bold rounded-pill shadow-sm"
            onClick={iniciarProcesoDePago}
          >
            Confirmar Pedido
          </Button>
        )}
      </Card.Footer>
    </Card>
  );
};

export default CarritoDeCompras;
