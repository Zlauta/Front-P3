import React, { useState } from "react";
import { Card, Row, Col, Spinner, Button } from "react-bootstrap";

const MenuCard = ({ nombre, descripcion, precio, categoria, imagen }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);

  const toggleDescription = () => setShowFullDescription(!showFullDescription);

  const shortDescription =
    descripcion && descripcion.length > 80
      ? descripcion.substring(0, 80) + " ... "
      : descripcion;

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
        boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
      }}
    >
      <Row className="g-0 align-items-center">
        <Col xs={12} md={5} style={{ position: "relative" }}>
          {imagen && !imageError ? (
            <>
              {!imageLoaded && (
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#122117",
                    borderRadius: "16px",
                  }}
                >
                  <Spinner animation="border" variant="light" size="sm" />
                </div>
              )}
              <Card.Img
                src={imagen}
                alt="Vista previa del menú"
                onLoad={() => setImageLoaded(true)}
                onError={() => setImageError(true)}
                style={{
                  height: "100%",
                  width: "94%",
                  objectFit: "cover",
                  borderRadius: "16px",
                  margin: "3%",
                  display: imageLoaded ? "block" : "none",
                }}
              />
            </>
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

            <Card.Text style={{ fontSize: "0.95rem", whiteSpace: "pre-line" }}>
              {showFullDescription
                ? descripcion
                : shortDescription || "Aquí aparecerá la descripción del menú."}
            </Card.Text>

            {descripcion && descripcion.length > 120 && (
              <Button
                variant="link"
                size="sm"
                onClick={toggleDescription}
                style={{
                  color: "#1aaf4b",
                  textDecoration: "none",
                  padding: 0,
                }}
              >
                {showFullDescription ? "Ver menos ▲" : "Ver más ▼"}
              </Button>
            )}

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

export default MenuCard;
