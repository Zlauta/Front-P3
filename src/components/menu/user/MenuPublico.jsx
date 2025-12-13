import React, { useEffect, useState } from "react";
import { Container, Row, Col, Spinner, Button, Alert } from "react-bootstrap";
import { obtenerProductosFiltrados } from "@/service/producto.service.js";
import MenuCard from "./TarjetaMenu.jsx";
import CarritoDeCompras from "@/components/carrito/CarritoDeCompras.jsx";

const MenuPublico = () => {
  const [listaDeProductos, setListaDeProductos] = useState([]);
  const [estaCargandoMenu, setEstaCargandoMenu] = useState(true);

  const [carritoDeCompras, setCarritoDeCompras] = useState([]);
  const [carritoCargado, setCarritoCargado] = useState(false);

  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("");
  const [numeroDePagina, setNumeroDePagina] = useState(1);
  const [metadatosPaginacion, setMetadatosPaginacion] = useState({});

  const token = localStorage.getItem("token");
  const email = localStorage.getItem("userEmail");
  const claveLocalStorage = `carrito_compras_${
    token ? `usuario_${email}` : "invitado"
  }`;

  useEffect(() => {
    const carritoGuardado = JSON.parse(localStorage.getItem(claveLocalStorage));
    if (carritoGuardado) {
      setCarritoDeCompras(carritoGuardado);
    }
    setCarritoCargado(true);
  }, [claveLocalStorage]);

  useEffect(() => {
    if (carritoCargado) {
      localStorage.setItem(claveLocalStorage, JSON.stringify(carritoDeCompras));
    }
  }, [carritoDeCompras, claveLocalStorage, carritoCargado]);

  useEffect(() => {
    setEstaCargandoMenu(true);
    obtenerProductosFiltrados(categoriaSeleccionada, numeroDePagina, 6)
      .then((respuesta) => {
        setListaDeProductos(respuesta.items || []);
        setMetadatosPaginacion(respuesta.meta || {});
      })
      .catch((error) => console.error("Error al cargar menú:", error))
      .finally(() => setEstaCargandoMenu(false));
  }, [categoriaSeleccionada, numeroDePagina]);

  const agregarProductoAlCarrito = (productoNuevo) => {
    setCarritoDeCompras((carritoActual) => {
      const yaExisteEnCarrito = carritoActual.find(
        (item) => item._id === productoNuevo._id
      );

      if (yaExisteEnCarrito) {
        return carritoActual.map((item) =>
          item._id === productoNuevo._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...carritoActual, { ...productoNuevo, quantity: 1 }];
      }
    });

    Swal.fire({
      title: "¡Producto Agregado!",
      text: productoNuevo.nombre,
      icon: "success",
      toast: true,
      position: "top-end",
      timer: 1500,
      showConfirmButton: false,
    });
  };

  const actualizarCantidadProducto = (idProducto, cantidadAOperar) => {
    setCarritoDeCompras((carritoActual) =>
      carritoActual.map((item) => {
        if (item._id === idProducto) {
          const nuevaCantidad = Math.max(1, item.quantity + cantidadAOperar);
          return { ...item, quantity: nuevaCantidad };
        }
        return item;
      })
    );
  };

  const eliminarProductoDelCarrito = (indiceParaEliminar) => {
    setCarritoDeCompras((carritoActual) =>
      carritoActual.filter((_, indice) => indice !== indiceParaEliminar)
    );
  };

  const totalAPagar = carritoDeCompras.reduce(
    (acumulador, producto) => acumulador + producto.precio * producto.quantity,
    0
  );

  if (estaCargandoMenu && listaDeProductos.length === 0) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" variant="success" />
      </div>
    );
  }

  return (
    <Container fluid className="py-4 px-lg-5">
      <Row>
        <Col lg={8} md={7} className="mb-5">
          <h2 className="text-success fw-bold mb-4">Nuestra Carta</h2>
          <div className="mb-4 d-flex gap-2 flex-wrap">
            {["entrada", "principal", "bebida", "postre"].map((categoria) => (
              <Button
                key={categoria}
                variant={
                  categoriaSeleccionada === categoria
                    ? "success"
                    : "outline-success"
                }
                onClick={() => {
                  setCategoriaSeleccionada(categoria);
                  setNumeroDePagina(1);
                }}
              >
                {categoria.charAt(0).toUpperCase() + categoria.slice(1)}
              </Button>
            ))}
            {categoriaSeleccionada && (
              <Button
                variant="link"
                className="text-decoration-none text-light"
                onClick={() => setCategoriaSeleccionada("")}
              >
                Ver todo
              </Button>
            )}
          </div>
          {listaDeProductos.length === 0 ? (
            <Alert variant="warning">
              No encontramos productos en esta categoría.
            </Alert>
          ) : (
            <Row className="g-4">
              {listaDeProductos.map((producto) => (
                <Col key={producto._id} sm={12}>
                  <MenuCard
                    {...producto}
                    isLogged={localStorage.getItem("token") ? true : false}
                    agregarProductoAlCarrito={agregarProductoAlCarrito}
                  />
                </Col>
              ))}
            </Row>
          )}

          {metadatosPaginacion.totalPages > 1 && (
            <div className="d-flex justify-content-center align-items-center gap-3 mt-5">
              <Button
                variant="success"
                disabled={numeroDePagina <= 1}
                onClick={() => setNumeroDePagina((p) => p - 1)}
              >
                Anterior
              </Button>

              <span className="fw-bold">
                Página {numeroDePagina} de {metadatosPaginacion.totalPages}
              </span>

              <Button
                variant="success"
                disabled={numeroDePagina >= metadatosPaginacion.totalPages}
                onClick={() => setNumeroDePagina((p) => p + 1)}
              >
                Siguiente
              </Button>
            </div>
          )}
        </Col>

        <Col lg={4} md={5}>
          <div className="sticky-top" style={{ top: "120px", zIndex: 10 }}>
            <CarritoDeCompras
              productosEnCarrito={carritoDeCompras}
              totalAPagar={totalAPagar}
              eliminarProductoDelCarrito={eliminarProductoDelCarrito}
              actualizarCantidadProducto={actualizarCantidadProducto}
            />
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default MenuPublico;
