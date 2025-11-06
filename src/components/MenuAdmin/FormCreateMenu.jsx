import React, { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { useDropzone } from "react-dropzone";
import {
  Form,
  Button,
  Container,
  Row,
  Col,
  Card,
} from "react-bootstrap";
import PreviewMenu from "./PreviewMenu";

const FormCreateMenu = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const [imagen, setImagen] = useState(null);
  const [preview, setPreview] = useState(null);

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      setImagen(file);
      setPreview(URL.createObjectURL(file));
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    multiple: false,
  });

  const onSubmit = (data) => {
    // 🚧 Lógica (Firebase + API) la agregás vos
    console.log({ ...data, imagen });
  };

  const nombre = watch("nombre");
  const descripcion = watch("descripcion");
  const precio = watch("precio");
  const categoria = watch("categoria");

  return (
    <Container className="mt-5 mb-5">
      <Card
        style={{
          backgroundColor: "#122117",
          color: "#ffffff",
          border: "none",
          borderRadius: "16px",
        }}
      >
        <Card.Body>
          <h3 className="text-center mb-4">Crear Nuevo Menú</h3>
          <Form noValidate onSubmit={handleSubmit(onSubmit)}>
            <Row>

              <Col xs={12} lg={6}>
                <Form.Group className="mb-3" controlId="nombre">
                  <Form.Label>Nombre del producto</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Ej: Pizza Napolitana"
                    isInvalid={!!errors.nombre}
                    {...register("nombre", { required: "El nombre es obligatorio" })}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.nombre?.message}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3" controlId="descripcion">
                  <Form.Label>Descripción</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Describe el menú..."
                    isInvalid={!!errors.descripcion}
                    {...register("descripcion", {
                      required: "La descripción es obligatoria",
                      minLength: {
                        value: 10,
                        message: "Debe tener al menos 10 caracteres",
                      },
                    })}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.descripcion?.message}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3" controlId="precio">
                  <Form.Label>Precio ($)</Form.Label>
                  <Form.Control
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="Ej: 1200"
                    isInvalid={!!errors.precio}
                    {...register("precio", {
                      required: "El precio es obligatorio",
                      min: { value: 0, message: "Debe ser positivo" },
                    })}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.precio?.message}
                  </Form.Control.Feedback>
                </Form.Group>


                <Form.Group className="mb-3" controlId="categoria">
                  <Form.Label>Categoría</Form.Label>
                  <Form.Select
                    isInvalid={!!errors.categoria}
                    {...register("categoria", {
                      required: "Selecciona una categoría",
                    })}
                  >
                    <option value="">Seleccionar categoría</option>
                    <option value="comida">Comida</option>
                    <option value="bebida">Bebida</option>
                    <option value="postre">Postre</option>
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {errors.categoria?.message}
                  </Form.Control.Feedback>
                </Form.Group>


                <Form.Group className="mb-3">
                  <Form.Label>Imagen del menú</Form.Label>
                  <div
                    {...getRootProps()}
                    style={{
                      border: "2px dashed #1aaf4b",
                      borderRadius: "12px",
                      padding: "30px",
                      textAlign: "center",
                      backgroundColor: isDragActive ? "#254630" : "transparent",
                      cursor: "pointer",
                      transition: "background-color 0.3s ease",
                    }}
                  >
                    <input {...getInputProps()} />
                    {preview ? (
                      <img
                        src={preview}
                        alt="Preview"
                        style={{
                          maxWidth: "100%",
                          height: "200px",
                          objectFit: "cover",
                          borderRadius: "12px",
                        }}
                      />
                    ) : (
                      <p style={{ color: "#ffffff" }}>
                        {isDragActive
                          ? "Suelta la imagen aquí..."
                          : "Arrastra o haz clic para seleccionar una imagen"}
                      </p>
                    )}
                  </div>
                </Form.Group>

                <div className="text-center mt-4">
                  <Button
                    type="submit"
                    style={{
                      backgroundColor: "#1aaf4b",
                      border: "none",
                      padding: "10px 40px",
                      fontSize: "1.1rem",
                      borderRadius: "8px",
                    }}
                  >
                    Guardar Menú
                  </Button>
                </div>
              </Col>

              <Col
                xs={12}
                lg={6}
                className="mt-4 mt-lg-0 d-flex justify-content-center align-items-start"
              >
                <PreviewMenu
                  nombre={nombre}
                  descripcion={descripcion}
                  precio={precio}
                  categoria={categoria}
                  imagen={preview}
                />
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default FormCreateMenu;