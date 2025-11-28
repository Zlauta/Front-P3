import React, { useEffect, useState } from "react";
import { Container, Row, Col, Spinner, Badge, Button, Alert } from "react-bootstrap";
import { obtenerProductos } from "../../service/products.service.js"; // <--- Tu service de productos
import MenuCard from "./MenuCard.jsx";
import Swal from "sweetalert2";
import CartModal from "../carrito/CartModal.jsx";

const PublicMenu = () => {
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLogged, setIsLogged] = useState(false);
  const [cart, setCart] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // Verificamos si hay token para saber si mostramos los botones de "Pedir"
    const token = localStorage.getItem("token");
    setIsLogged(!!token);

    const fetchMenus = async () => {
      try {
        const data = await obtenerProductos();
        setMenus(data || []);
      } catch (err) {
        console.error("Error cargando menú");
      } finally {
        setLoading(false);
      }
    };
    fetchMenus();
  }, []);

  const handleAddToCart = (producto) => {
    setCart((prevCart) => {
      const existe = prevCart.find((item) => item._id === producto._id);
      if (existe) {
        return prevCart.map((item) =>
          item._id === producto._id ? { ...item, quantity: (item.quantity || 1) + 1 } : item
        );
      } else {
        return [...prevCart, { ...producto, quantity: 1 }];
      }
    });

    // Feedback visual tipo Toast
    Swal.fire({
      position: "top-end",
      icon: "success",
      title: "¡Agregado!",
      text: `${producto.nombre} al carrito`,
      showConfirmButton: false,
      timer: 1500,
      toast: true,
      background: "#fff"
    });
  };

  const totalCart = cart.reduce((acc, item) => acc + (item.precio * item.quantity), 0);
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  if (loading) return <div className="text-center mt-5"><Spinner animation="border" variant="success" /></div>;

  return (
    <Container className="py-5">
      {/* MODAL (Invisible hasta que se activa) */}
      <CartModal 
        show={showModal} 
        handleClose={() => setShowModal(false)} 
        cart={cart}
        total={totalCart}
      />

      {/* BOTÓN FLOTANTE DEL CARRITO */}
      {cart.length > 0 && (
        <div className="position-fixed bottom-0 end-0 p-3" style={{ zIndex: 1000 }}>
          <Button 
            variant="success" 
            onClick={() => setShowModal(true)}
            style={{ boxShadow: "0 4px 6px rgba(0,0,0,0.2)" }}
          >
            Ver Carrito <Badge bg="light" text="dark" pill className="ms-1">{totalItems}</Badge>
          </Button>
        </div>
      )}

      <h2 className="text-center mb-4" style={{ color: "#1aaf4b" }}>Nuestra Carta</h2>
      
      {menus.length === 0 ? (
          <Alert variant="warning" className="text-center">No hay menús disponibles.</Alert>
      ) : (
        <Row className="g-4">
          {menus.map((menu) => (
            <Col key={menu._id} xs={12} sm={10} lg={8}>
              <MenuCard 
                {...menu} 
                isLogged={isLogged} 
                addToCart={handleAddToCart} 
              />
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default PublicMenu;