import React from 'react';
import { useForm } from 'react-hook-form';
import { Form, Button, Container, Row, Col, Card, Spinner } from 'react-bootstrap';
import { useReservaLogica } from '@/hook/useReservaLogica.js';

const FormularioReserva = ({ onReservaCreada }) => {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isValid },
  } = useForm({ mode: 'onChange' });

  const {
    loading,
    minDate,
    minTime,
    fechaSeleccionada,
    mesaSeleccionada,
    personasSeleccionadas,
    validarCapacidadMesa,
    verificarDisponibilidad,
    handleReservaSubmit,
    validarHorarioAtencion,
    obtenerMesasDisponibles,
  } = useReservaLogica(watch, reset);

  const personas = watch('cantidadPersonas');
  const mesasDisponibles = obtenerMesasDisponibles(personas);

  const onSubmit = async (data) => {
    await handleReservaSubmit(data);
    if (onReservaCreada) {
      onReservaCreada();
    }
  };

  return (
    <Container className="mt-5 mb-5">
      <Row className="justify-content-center">
        <Col xs={12} md={8} lg={6}>
          <Card
            style={{
              backgroundColor: '#254630',
              color: '#ffffff',
              border: 'none',
              borderRadius: '16px',
              boxShadow: '0 4px 30px rgba(0,0,0,0.5)',
            }}
          >
            <Card.Body className="p-4">
              <h3 className="text-center mb-4">Nueva Reserva</h3>
              <p className="text-center text-light mb-3">
                Para reservas hasta <strong>10 personas</strong>, completa este formulario.
                <br />
                Si son más de 10 personas, hacenos tu pedido en el{' '}
                <a href="/contacto" style={{ color: '#ffc107', textDecoration: 'underline' }}>
                  formulario de contactos
                </a>
                .
              </p>

              <Form noValidate onSubmit={handleSubmit(onSubmit)}>
                <Row>
                  <Col xs={6}>
                    <Form.Group className="mb-3" controlId="cantidadPersonas">
                      <Form.Label>Personas</Form.Label>
                      <Form.Control
                        type="number"
                        placeholder="Cant."
                        isInvalid={!!errors.cantidadPersonas}
                        {...register('cantidadPersonas', {
                          required: 'Requerido',
                          valueAsNumber: true,
                          min: { value: 1, message: 'Mín 1' },
                          validate: (val) => validarCapacidadMesa(mesaSeleccionada, val),
                        })}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.cantidadPersonas?.message}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>

                  <Col xs={6}>
                    <Form.Group className="mb-3" controlId="mesa">
                      <Form.Label>Mesa</Form.Label>
                      <Form.Select
                        isInvalid={!!errors.mesa}
                        {...register('mesa', {
                          required: 'Requerido',
                          validate: (val) =>
                            validarCapacidadMesa(val, personasSeleccionadas) === true ||
                            validarCapacidadMesa(val, personasSeleccionadas),
                        })}
                      >
                        <option value="">Seleccione una mesa</option>
                        {mesasDisponibles.map((m) => (
                          <option key={m} value={m}>
                            Mesa {m}
                          </option>
                        ))}
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">
                        {errors.mesa?.message}
                      </Form.Control.Feedback>
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
                        {...register('fecha', {
                          required: 'Requerido',
                          validate: (val) => val >= minDate || 'No puede ser pasada',
                        })}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.fecha?.message}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>

                  <Col xs={12} sm={6}>
                    <Form.Group className="mb-3" controlId="hora">
                      <Form.Label>Hora</Form.Label>
                      <Form.Control
                        type="time"
                        min={minTime}
                        isInvalid={!!errors.hora}
                        {...register('hora', {
                          required: 'Requerido',
                          pattern: {
                            value: /^([01]\d|2[0-3]):([0-5]\d)$/,
                            message: 'Hora inválida',
                          },
                          validate: {
                            checkHorario: (val) =>
                              validarHorarioAtencion(val) ||
                              'Horarios de atencion 10hs a 16hs y 21hs a 02hs',
                            checkPasado: (val) =>
                              fechaSeleccionada === minDate && val < minTime
                                ? 'Hora inválida hoy'
                                : true,
                            checkDisponibilidad: (val) =>
                              verificarDisponibilidad(val) || 'Mesa ocupada (margen 2hs)',
                          },
                        })}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.hora?.message}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-4" controlId="notas">
                  <Form.Label>Notas</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Preferencias..."
                    isInvalid={!!errors.notas}
                    {...register('notas', {
                      maxLength: { value: 200, message: 'Máx 200 caracteres' },
                    })}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.notas?.message}
                  </Form.Control.Feedback>
                </Form.Group>

                <div className="text-center">
                  <Button
                    type="submit"
                    disabled={!isValid || loading}
                    className="w-100"
                    style={{
                      backgroundColor: isValid ? '#1aaf4b' : '#5a5a5a',
                      border: 'none',
                    }}
                  >
                    {loading ? <Spinner animation="border" size="sm" /> : 'Confirmar Reserva'}
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

export default FormularioReserva;
