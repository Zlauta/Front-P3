import React from "react";
import { Card, Row, Col } from "react-bootstrap";

const PreviewMenu = ({ nombre, descripcion, precio, categoria, imagen }) => {
  return (
    <Card
      style={{
        backgroundColor: "#254630",
        color: "#ffffff",
        border: "none",
        borderRadius: "16px",
        width: "100%",
        maxWidth: "600px",
        overflow: "hidden",
      }}
    >
      <Row className="g-0 align-items-center">
        <Col xs={12} md={5}>
          {imagen ? (
            <Card.Img
              src={imagen}
              alt="Vista previa del menú"
              style={{
                height: "100%",
                width: "94%",
                objectFit: "cover",
                borderRadius: "16px",
                margin: "3%",
              }}
            />
          ) : (
            <div
              style={{
                height: "100%",
                minHeight: "180px",
                backgroundColor: "#122117",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#ffffff80",
                borderRadius: "16px 0 0 16px",
              }}
            >
              Sin imagen
            </div>
          )}
        </Col>

        <Col xs={12} md={7}>
          <Card.Body>
            <Card.Title style={{ fontSize: "1.3rem", fontWeight: "bold" }}>
              {nombre || "Nombre del menú"}
            </Card.Title>
            <Card.Subtitle
              className="mb-2"
              style={{ color: "#1aaf4b", fontWeight: "500" }}
            >
              {categoria || "Categoría"}
            </Card.Subtitle>
            <Card.Text style={{ fontSize: "0.95rem" }}>
              {descripcion.length > 100
                ? descripcion.substring(0, 100) + " ... "
                : descripcion || "Aquí aparecerá la descripción del menú."}
            </Card.Text>
            <Card.Text
              style={{
                fontWeight: "bold",
                fontSize: "1.1rem",
                color: "#1aaf4b",
                marginTop: "8px",
              }}
            >
              {precio ? `$${precio}` : "Precio pendiente"}
            </Card.Text>
          </Card.Body>
        </Col>
      </Row>
    </Card>
  );
};

export default PreviewMenu;
