import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2"; // 🔹 Importamos SweetAlert2
import {
  Form,
  Button,
  Container,
  Row,
  Col,
  Card,
  Spinner,
} from "react-bootstrap";

const FormReserva = () => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isValid },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      usuario: "",
      usuarioEmail: "",
      mesa: "",
      cantidadPersonas: "",
      fecha: "",
      hora: "",
      notas: "",
    },
  });

  const [loading, setLoading] = useState(false);
  const [minDate, setMinDate] = useState("");
  const [minTime, setMinTime] = useState("");

  const fechaSeleccionada = watch("fecha");

  useEffect(() => {
    const nombre = sessionStorage.getItem("nombre") || "";
    const email = sessionStorage.getItem("email") || "";
    setValue("usuario", nombre);
    setValue("usuarioEmail", email);
  }, [setValue]);

  useEffect(() => {
    const hoy = new Date();
    const yyyy = hoy.getFullYear();
    const mm = String(hoy.getMonth() + 1).padStart(2, "0");
    const dd = String(hoy.getDate()).padStart(2, "0");
    setMinDate(`${yyyy}-${mm}-${dd}`);
  }, []);

  useEffect(() => {
    if (!fechaSeleccionada) return;
    const hoy = new Date();
    const fechaElegida = new Date(fechaSeleccionada + "T00:00:00");

    if (fechaElegida.toDateString() === hoy.toDateString()) {
      const hh = String(hoy.getHours()).padStart(2, "0");
      const mm = String(hoy.getMinutes()).padStart(2, "0");
      setMinTime(`${hh}:${mm}`);
    } else {
      setMinTime("");
    }
  }, [fechaSeleccionada]);

  const onSubmit = async (data) => {
    setLoading(true);

    if (data.fecha < minDate) {
      Swal.fire({
        icon: "error",
        title: "Fecha inválida",
        text: "La fecha no puede ser pasada.",
        confirmButtonColor: "#d33",
      });
      setLoading(false);
      return;
    }

    if (data.fecha === minDate && data.hora < minTime) {
      Swal.fire({
        icon: "error",
        title: "Hora inválida",
        text: "La hora no puede ser del pasado.",
        confirmButtonColor: "#d33",
      });
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("http://localhost:3000/api/reservas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const responseData = await res.json();

      if (!res.ok) {
        throw new Error(responseData.message || "Error al crear la reserva");
      }

      // 🔹 Alerta de Éxito
      Swal.fire({
        icon: "success",
        title: "¡Reserva Creada!",
        text: "Tu mesa ha sido reservada con éxito.",
        confirmButtonColor: "#1aaf4b",
      });

      reset({
        usuario: sessionStorage.getItem("nombre") || "",
        usuarioEmail: sessionStorage.getItem("email") || "",
        mesa: "",
        cantidadPersonas: "",
        fecha: "",
        hora: "",
        notas: "",
      });
    } catch (error) {
      console.error("Error al enviar la reserva:", error);
      // 🔹 Alerta de Error
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "Hubo un problema al conectar con el servidor",
        confirmButtonColor: "#d33",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="mt-5 mb-5">
      <Row className="justify-content-center">
        <Col xs={12} md={8} lg={6}>
          <Card
            style={{
              backgroundColor: "#254630",
              color: "#ffffff",
              border: "none",
              borderRadius: "16px",
              boxShadow: "0 4px 30px rgba(0, 0, 0, 0.5)",
            }}
          >
            <Card.Body className="p-4">
              <h3 className="text-center mb-4">Nueva Reserva</h3>

              <Form noValidate onSubmit={handleSubmit(onSubmit)}>
                <Row>
                  <Col xs={6}>
                    <Form.Group className="mb-3" controlId="mesa">
                      <Form.Label>Mesa</Form.Label>
                      <Form.Control
                        type="number"
                        placeholder="#"
                        min="1"
                        isInvalid={!!errors.mesa}
                        {...register("mesa", {
                          required: "Requerido",
                          min: { value: 1, message: "Mínimo 1" },
                        })}
                      />
                    </Form.Group>
                  </Col>

                  <Col xs={6}>
                    <Form.Group className="mb-3" controlId="cantidadPersonas">
                      <Form.Label>Personas</Form.Label>
                      <Form.Control
                        type="number"
                        placeholder="Cant."
                        min="1"
                        isInvalid={!!errors.cantidadPersonas}
                        {...register("cantidadPersonas", {
                          required: "Requerido",
                          min: { value: 1, message: "Mínimo 1 persona" },
                        })}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col xs={12} sm={6}>
                    <Form.Group className="mb-3" controlId="fecha">
                      <Form.Label>Fecha</Form.Label>
                      <Form.Control
                        type="date"
                        min={minDate}
                        isInvalid={!!errors.fecha}
                        {...register("fecha", {
                          required: "Seleccione una fecha",
                          validate: (value) =>
                            value >= minDate || "La fecha no puede ser pasada",
                        })}
                      />
                    </Form.Group>
                  </Col>

                  <Col xs={12} sm={6}>
                    <Form.Group className="mb-3" controlId="hora">
                      <Form.Label>Hora</Form.Label>
                      <Form.Control
                        type="time"
                        min={minTime}
                        isInvalid={!!errors.hora}
                        {...register("hora", {
                          required: "Seleccione una hora",
                          validate: (value) => {
                            if (fechaSeleccionada === minDate && value < minTime) {
                              return "Hora inválida para hoy";
                            }
                            return true;
                          },
                        })}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-4" controlId="notas">
                  <Form.Label>Notas Adicionales</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Alguna preferencia especial..."
                    {...register("notas")}
                  />
                </Form.Group>

                <div className="text-center">
                  <Button
                    type="submit"
                    disabled={!isValid || loading}
                    className="w-100"
                    style={{
                      backgroundColor: isValid ? "#1aaf4b" : "#5a5a5a",
                      border: "none",
                      padding: "10px",
                      fontSize: "1.1rem",
                      borderRadius: "8px",
                      transition: "all 0.3s ease",
                    }}
                  >
                    {loading ? (
                      <Spinner animation="border" size="sm" />
                    ) : (
                      "Confirmar Reserva"
                    )}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default FormReserva;