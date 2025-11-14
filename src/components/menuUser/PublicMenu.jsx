import React, { useEffect, useState } from "react";
import { Container, Row, Col, Spinner, Alert } from "react-bootstrap";
import { obtenerProductos } from "../../service/products.service.js";
import MenuCard from "./MenuCard.jsx";

const PublicMenu = () => {
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMenus = async () => {
      try {
        const data = await obtenerProductos();
        setMenus(data || []);
      } catch (err) {
        setError("No se pudieron obtener los menús");
      } finally {
        setLoading(false);
      }
    };

    fetchMenus();
  }, []);

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "70vh",
        }}
      >
        <Spinner animation="border" variant="success" />
      </div>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger" className="text-center">
          {error}
        </Alert>
      </Container>
    );
  }

  if (menus.length === 0) {
    return (
      <Container className="py-5">
        <Alert
          className="text-center"
          style={{ background: "#254630", color: "#fff" }}
        >
          No hay menús disponibles por el momento
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <h2 className="text-center mb-4" style={{ color: "#1aaf4b" }}>
        Nuestra Carta
      </h2>

      <Row className="g-4 justify-content-start">
        {menus.map((menu) => (
          <Col key={menu._id} xs={12} sm={10} lg={8}>
            <MenuCard {...menu} />
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default PublicMenu;
