import React, { useState, useEffect } from "react";
import { Modal, Button, ListGroup, Spinner, Form } from "react-bootstrap";
import { initMercadoPago, Wallet } from "@mercadopago/sdk-react";
import Swal from "sweetalert2"; 
import { crearPreferenciaPago } from "../../service/pagos.service.js";

// Inicializamos Mercado Pago (Asegúrate de que la variable de entorno esté bien configurada)
initMercadoPago(import.meta.env.VITE_MP_PUBLIC_KEY, { locale: "es-AR" });

const CartModal = ({ show, handleClose, cart, total, removeFromCart }) => {
  
  const [preferenceId, setPreferenceId] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [telefono, setTelefono] = useState("");
  const [direccion, setDireccion] = useState("");
  const [validated, setValidated] = useState(false);

  useEffect(() => {
    if (show) {
      setPreferenceId(null);
      setValidated(false);
    }
  }, [show, cart]);

  const iniciarPago = async () => {
    const phonePattern = /^[\+]?[0-9\s-]{8,25}$/;
    const isPhoneValid = phonePattern.test(telefono);
    const isAddressValid = direccion.trim().length >= 10;

    if (!isPhoneValid || !isAddressValid) {
      setValidated(true); 
      Swal.fire({
        icon: "warning",
        title: "Datos incorrectos",
        text: "Por favor revisa que el teléfono sea válido y la dirección tenga al menos 10 caracteres.",
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
                <ListGroup.Item key={index} className="d-flex justify-content-between align-items-center px-0">
                  <div className="ms-2 me-auto">
                    <div className="fw-bold">{item.nombre}</div>
                    <div className="text-muted" style={{ fontSize: "0.85rem" }}>
                        ${item.precio} x {item.quantity}
                    </div>
                  </div>

                  <span className="fw-bold text-success me-3">
                      ${item.precio * item.quantity}
                  </span>

                  <Button 
                    variant="outline-danger" 
                    size="sm" 
                    onClick={() => removeFromCart(index)}
                    title="Quitar del carrito"
                    style={{ borderRadius: "50%", width: "30px", height: "30px", padding: "0", lineHeight: "0" }}
                  >
                    ✕
                  </Button>
                </ListGroup.Item>
              ))}
            </ListGroup>

            <div className="d-flex justify-content-between align-items-center mt-4 pt-3 border-top">
              <h5>Total a pagar:</h5>
              <h3 className="fw-bold" style={{ color: "#1aaf4b" }}>${total}</h3>
            </div>

            <Form className="mt-3" noValidate validated={validated}>
              
              <Form.Group className="mb-3" controlId="formTelefono">
                <Form.Label>Teléfono</Form.Label>
                <Form.Control
                  type="tel"
                  placeholder="Ej: +54 9 381 123456"
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                  required
                  pattern="^[\+]?[0-9\s-]{8,25}$" 
                />
                <Form.Control.Feedback type="invalid">
                  Ingresa un número válido (mínimo 8 dígitos).
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3" controlId="formDireccion">
                <Form.Label>Dirección</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Ej: Av. Siempre Viva 742 (Casa/Depto)"
                  value={direccion}
                  onChange={(e) => setDireccion(e.target.value)}
                  required
                  minLength="10" 
                  maxLength="100"
                />
                <Form.Control.Feedback type="invalid">
                  La dirección es muy corta (mínimo 10 caracteres).
                </Form.Control.Feedback>
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
          <Button 
            variant="success" 
            onClick={iniciarPago} 
            className="w-100"
            disabled={cart.length === 0}
          >
            Confirmar e Iniciar Pago
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default CartModal;