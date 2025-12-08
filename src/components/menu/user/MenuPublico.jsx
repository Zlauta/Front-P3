import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Spinner,
  Badge,
  Button,
  Alert,
} from "react-bootstrap";
import {
  obtenerProductos,
  obtenerProductosFiltrados,
} from "../../../service/producto.service.js";
import MenuCard from "./TarjetaMenu.jsx";
import Swal from "sweetalert2";
import CartModal from "../../carrito/CarritoModal.jsx";

const MenuPublico = () => {
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLogged, setIsLogged] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [cart, setCart] = useState([]);
  const [cartKey, setCartKey] = useState("cart_guest");

  // 🔎 Estados para filtros y paginación
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({});

  // 1. CARGA INICIAL (Detectar usuario por EMAIL y cargar SU carrito)
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userEmail = localStorage.getItem("userEmail");

    setIsLogged(!!token);

    let currentKey = "cart_guest";

    if (token && userEmail) {
      currentKey = `cart_user_${userEmail}`;
    }

    setCartKey(currentKey);

    const savedCart = localStorage.getItem(currentKey);
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    } else {
      setCart([]);
    }
  }, []);

  // 2. Cargar productos con filtros y paginación
  useEffect(() => {
    const fetchMenus = async () => {
      setLoading(true);
      try {
        const data = await obtenerProductosFiltrados(category, page, 6);
        setMenus(data.items || []);
        setMeta(data.meta || {});
      } catch (err) {
        console.error("Error cargando menú", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMenus();
  }, [category, page]);

  // 3. Guardar carrito en localStorage
  useEffect(() => {
    if (cartKey) {
      localStorage.setItem(cartKey, JSON.stringify(cart));
    }
  }, [cart, cartKey]);

  const handleAddToCart = (producto) => {
    setCart((prevCart) => {
      const existe = prevCart.find((item) => item._id === producto._id);
      if (existe) {
        return prevCart.map((item) =>
          item._id === producto._id
            ? { ...item, quantity: (item.quantity || 1) + 1 }
            : item
        );
      } else {
        return [...prevCart, { ...producto, quantity: 1 }];
      }
    });

    Swal.fire({
      position: "top-end",
      icon: "success",
      title: "¡Agregado!",
      text: `${producto.nombre} al carrito`,
      showConfirmButton: false,
      timer: 1500,
      toast: true,
      background: "#fff",
    });
  };

  const handleRemoveFromCart = (indexToRemove) => {
    setCart((prevCart) =>
      prevCart.filter((_, index) => index !== indexToRemove)
    );
  };

  const totalCart = cart.reduce(
    (acc, item) => acc + item.precio * item.quantity,
    0
  );
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  if (loading)
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" variant="success" />
      </div>
    );

  return (
    <Container className="py-5">
      <CartModal
        show={showModal}
        handleClose={() => setShowModal(false)}
        cart={cart}
        total={totalCart}
        removeFromCart={handleRemoveFromCart}
      />

      {cart.length > 0 && (
        <div
          className="position-fixed bottom-0 end-0 p-3"
          style={{ zIndex: 1000 }}
        >
          <Button
            variant="success"
            onClick={() => setShowModal(true)}
            style={{ boxShadow: "0 4px 6px rgba(0,0,0,0.2)" }}
          >
            Ver Carrito{" "}
            <Badge bg="light" text="dark" pill className="ms-1">
              {totalItems}
            </Badge>
          </Button>
        </div>
      )}

      <h2 className="text-center mb-4" style={{ color: "#1aaf4b" }}>
        Nuestra Carta
      </h2>

      {/* 🔎 Botones de categoría */}
      <div className="text-center mb-4">
        {["entrada", "principal", "bebida", "postre"].map((cat) => (
          <Button
            key={cat}
            variant={category === cat ? "success" : "outline-success"}
            className="mx-2"
            onClick={() => {
              setCategory(cat);
              setPage(1);
            }}
          >
            {cat}
          </Button>
        ))}
      </div>

      {menus.length === 0 ? (
        <Alert variant="warning" className="text-center">
          No hay menús disponibles.
        </Alert>
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

      {/* 🔎 Paginación */}
      {meta.totalPages > 1 && (
        <div className="text-center mt-4">
          <Button
            variant="success"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
            className="mx-2"
          >
            ← Anterior
          </Button>
          <span>
            Página {meta.currentPage} de {meta.totalPages}
          </span>
          <Button
            variant="success"
            disabled={page >= meta.totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="mx-2"
          >
            Siguiente →
          </Button>
        </div>
      )}
    </Container>
  );
};

export default MenuPublico;
