import React, { useState } from "react";
import { Card, Row, Col, Spinner, Button } from "react-bootstrap";

const TarjetaMenu = ({
  _id,
  nombre,
  descripcion,
  precio,
  categoria,
  imagen,
  isLogged,
  addToCart,
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [showFull, setShowFull] = useState(false);

  return (
    <Card
      style={{
        backgroundColor: "#254630",
        color: "#fff",
        borderRadius: "16px",
        overflow: "hidden",
        border: "none",
      }}
    >
      <Row className="g-0 align-items-center">
        <Col xs={12} md={5}>
          <div
            style={{ position: "relative", height: "200px", margin: "10px" }}
          >
            {!imageLoaded && (
              <div
                style={{
                  position: "absolute",
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  background: "#122117",
                  borderRadius: "10px",
                }}
              >
                <Spinner animation="border" variant="light" size="sm" />
              </div>
            )}
            <Card.Img
              src={imagen}
              onLoad={() => setImageLoaded(true)}
              style={{
                height: "100%",
                width: "100%",
                objectFit: "cover",
                borderRadius: "10px",
                display: imageLoaded ? "block" : "none",
              }}
            />
          </div>
        </Col>
        <Col xs={12} md={7}>
          <Card.Body>
            <Card.Title style={{ fontWeight: "bold" }}>{nombre}</Card.Title>
            <Card.Subtitle className="mb-2 text-success">
              {categoria}
            </Card.Subtitle>

            <Card.Text style={{ fontSize: "0.9rem" }}>
              {showFull
                ? descripcion
                : descripcion?.substring(0, 80) +
                  (descripcion?.length > 80 ? "..." : "")}
            </Card.Text>

            {descripcion?.length > 80 && (
              <Button
                variant="link"
                size="sm"
                onClick={() => setShowFull(!showFull)}
                style={{ color: "#1aaf4b", padding: 0, textDecoration: "none" }}
              >
                {showFull ? "Ver menos" : "Ver más"}
              </Button>
            )}

            <div className="d-flex justify-content-between align-items-center mt-3">
              <h5 className="text-success m-0 fw-bold">${precio}</h5>

              {isLogged && (
                <Button
                  onClick={() => addToCart({ _id, nombre, precio, imagen })}
                  style={{
                    backgroundColor: "#1aaf4b",
                    border: "none",
                    borderRadius: "20px",
                    fontWeight: "bold",
                  }}
                >
                  Pedir
                </Button>
              )}
            </div>
          </Card.Body>
        </Col>
      </Row>
    </Card>
  );
};

export default TarjetaMenu;
