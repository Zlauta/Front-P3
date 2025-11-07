import React from "react";
import { Card, Button, Row, Col, Container } from "react-bootstrap";

const ListMenu = ({ menus = [] }) => {
  return (
    <div
      style={{
        backgroundColor: "#122117",
        minHeight: "100vh",
        padding: "40px 0",
      }}
    >
      <Container>
        <h2
          style={{
            color: "#ffffff",
            textAlign: "center",
            marginBottom: "2rem",
          }}
        >
          Listado de Menús
        </h2>

        <Row className="g-4 justify-content-center">
          {menus.length > 0 ? (
            menus.map((menu) => (
              <Col
                key={menu._id || menu.id}
                xs={12}
                sm={6}
                md={4}
                lg={3}
                className="d-flex justify-content-center"
              >
                <Card
                  style={{
                    backgroundColor: "#254630",
                    color: "#ffffff",
                    borderRadius: "16px",
                    width: "100%",
                    maxWidth: "280px",
                    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)",
                    overflow: "hidden",
                    transition: "transform 0.2s ease",
                  }}
                  className="menu-card"
                >
                  <Card.Img
                    variant="top"
                    src={menu.imagen || "/placeholder.png"}
                    alt={menu.nombre}
                    style={{
                      height: "180px",
                      objectFit: "cover",
                    }}
                  />
                  <Card.Body>
                    <Card.Title
                      style={{
                        fontSize: "1.2rem",
                        fontWeight: "bold",
                        color: "#1aaf4b",
                      }}
                    >
                      {menu.nombre}
                    </Card.Title>
                    <Card.Text
                      style={{
                        color: "#ffffffcc",
                        fontSize: "0.9rem",
                      }}
                    >
                      {menu.descripcion?.length > 80
                        ? menu.descripcion.slice(0, 80) + "..."
                        : menu.descripcion}
                    </Card.Text>
                    <Card.Text
                      style={{
                        fontWeight: "bold",
                        color: "#1aaf4b",
                        marginBottom: "1rem",
                      }}
                    >
                      ${menu.precio}
                    </Card.Text>

                    <div className="d-flex justify-content-between">
                      <Button
                        variant="success"
                        style={{
                          backgroundColor: "#1aaf4b",
                          border: "none",
                          borderRadius: "10px",
                          fontWeight: "500",
                          width: "48%",
                        }}
                      >
                        Editar
                      </Button>
                      <Button
                        variant="danger"
                        style={{
                          backgroundColor: "#8b0000",
                          border: "none",
                          borderRadius: "10px",
                          fontWeight: "500",
                          width: "48%",
                        }}
                      >
                        Eliminar
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))
          ) : (
            <p
              style={{
                color: "#ffffffb3",
                textAlign: "center",
                fontStyle: "italic",
              }}
            >
              No hay menús cargados aún.
            </p>
          )}
        </Row>
      </Container>
    </div>
  );
};

export default ListMenu;