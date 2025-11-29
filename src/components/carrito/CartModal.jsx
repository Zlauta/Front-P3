import React, { useState, useEffect } from "react";
import { Modal, Button, ListGroup, Spinner, Form } from "react-bootstrap";
import { initMercadoPago, Wallet } from "@mercadopago/sdk-react";
import Swal from "sweetalert2"; 
import { crearPreferenciaPago } from "../../service/pagos.service.js";

// Inicializamos Mercado Pago leyendo la variable de entorno
initMercadoPago(import.meta.env.VITE_MP_PUBLIC_KEY, { locale: "es-AR" });

const CartModal = ({ show, handleClose, cart, total }) => {
  const [preferenceId, setPreferenceId] = useState(null);
  const [cargando, setCargando] = useState(false);

  // 🔎 Estados para el formulario
  const [telefono, setTelefono] = useState("");
  const [direccion, setDireccion] = useState("");

  useEffect(() => {
    if (show && cart.length > 0) {
      // No iniciar pago automáticamente, esperar que el usuario complete el formulario
      setPreferenceId(null);
    }
  }, [show, cart]);

  const iniciarPago = async () => {
    if (!telefono || !direccion) {
      Swal.fire({
        icon: "warning",
        title: "Datos incompletos",
        text: "Por favor ingresa tu teléfono y dirección antes de continuar.",
        confirmButtonColor: "#254630",
      });
      return;
    }

    setCargando(true);

    const datosPedido = {
      items: cart,
      total: total,
      direccion,
      telefono,
    };

    try {
      const datos = await crearPreferenciaPago(datosPedido);
      if (datos.id) {
        setPreferenceId(datos.id);
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "No se pudo iniciar el pago",
        text: error.message,
        confirmButtonColor: "#254630",
        confirmButtonText: "Entendido",
      });
    } finally {
      setCargando(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton style={{ backgroundColor: "#254630", color: "white" }}>
        <Modal.Title>Tu Pedido</Modal.Title>
      </Modal.Header>
      
      <Modal.Body>
        {cart.length === 0 ? (
          <div className="text-center py-4 text-muted">
            El carrito está vacío.
          </div>
        ) : (
          <>
            <ListGroup variant="flush">
              {cart.map((item, index) => (
                <ListGroup.Item key={index} className="d-flex justify-content-between align-items-center">
                  <div>
                    <strong>{item.nombre}</strong>
                    <div className="text-muted" style={{ fontSize: "0.85rem" }}>x{item.quantity}</div>
                  </div>
                  <span className="fw-bold text-success">${item.precio * item.quantity}</span>
                </ListGroup.Item>
              ))}
            </ListGroup>

            <div className="d-flex justify-content-between align-items-center mt-4 pt-3 border-top">
              <h5>Total a pagar:</h5>
              <h3 className="fw-bold" style={{ color: "#1aaf4b" }}>${total}</h3>
            </div>

            {/* 🔎 Formulario para teléfono y dirección */}
            <Form className="mt-3">
              <Form.Group className="mb-3" controlId="formTelefono">
                <Form.Label>Teléfono</Form.Label>
                <Form.Control
                  type="tel"
                  placeholder="Ej: +54 9 381 123456"
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formDireccion">
                <Form.Label>Dirección</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Ej: Av. Siempre Viva 742"
                  value={direccion}
                  onChange={(e) => setDireccion(e.target.value)}
                  required
                />
              </Form.Group>
            </Form>
          </>
        )}
      </Modal.Body>

      <Modal.Footer>
        {cargando ? (
          <div className="w-100 text-center">
            <Spinner animation="border" variant="success" size="sm" /> 
            <span className="ms-2">Cargando pago...</span>
          </div>
        ) : preferenceId && cart.length > 0 ? (
          <div style={{ width: "100%" }}>
            <Wallet initialization={{ preferenceId: preferenceId }} />
          </div>
        ) : (
          <Button variant="success" onClick={iniciarPago} className="w-100">
            Iniciar Pago
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default CartModal;
