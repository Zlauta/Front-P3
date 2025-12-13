import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { FaStar } from 'react-icons/fa';
import { crearResenia } from '@/service/resenias.service.js';
import Swal from 'sweetalert2';

const CrearReseniaModal = ({ show, handleClose, updateList }) => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);

  // Estilos (Tus colores)
  const styles = {
    modalContent: {
      backgroundColor: '#254630',
      color: '#fff',
      border: '1px solid #1aaf4b',
    },
    // Nota: El borde se sobrescribe automáticamente a rojo si hay error gracias a 'isInvalid'
    input: {
      backgroundColor: '#122117',
      color: '#fff',
      border: '1px solid #1aaf4b',
    },
    btnPrimary: {
      backgroundColor: '#1aaf4b',
      borderColor: '#1aaf4b',
      color: '#fff',
      fontWeight: 'bold',
    },
    btnSecondary: { backgroundColor: '#6c757d', border: 'none', color: '#fff' },
    star: { cursor: 'pointer', transition: 'color 200ms' },
  };

  const onSubmit = async (data) => {
    // Validación manual para las estrellas (visual)
    if (rating === 0) {
      // Opcional: Podrías usar trigger() aquí, pero el Swal es más efectivo para este campo custom
      return;
    }

    try {
      await crearResenia({ ...data, calificacion: rating });

      Swal.fire({
        icon: 'success',
        title: '¡Reseña creada!',
        background: '#254630',
        color: '#fff',
        confirmButtonColor: '#1aaf4b',
      });

      reset();
      setRating(0);
      updateList();
      handleClose();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered backdrop="static">
      <Modal.Header closeButton style={{ ...styles.modalContent, borderBottom: 'none' }}>
        <Modal.Title>Dejar una Reseña</Modal.Title>
      </Modal.Header>

      <Modal.Body style={styles.modalContent}>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Form.Group className="mb-3" controlId="formNombre">
            <Form.Label>Tu Nombre</Form.Label>
            <Form.Control
              type="text"
              placeholder="Ej: Juan Perez"
              style={styles.input}
              // isInvalid activa el borde rojo de Bootstrap
              isInvalid={!!errors.nombre}
              {...register('nombre', {
                required: 'El nombre es obligatorio',
                minLength: { value: 2, message: 'Mínimo 2 caracteres' },
                maxLength: { value: 50, message: 'Máximo 50 caracteres' },
                pattern: {
                  value: /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s'-]+$/,
                  message: 'Solo letras y espacios',
                },
              })}
            />
            {/* FEEDBACK VISUAL: Mensaje rojo nativo de Bootstrap */}
            <Form.Control.Feedback type="invalid">{errors.nombre?.message}</Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3 text-center">
            <Form.Label className="d-block">Calificación</Form.Label>
            <div className="d-flex justify-content-center gap-2">
              {[...Array(5)].map((star, index) => {
                const ratingValue = index + 1;
                return (
                  <label key={index}>
                    <input
                      type="radio"
                      name="calificacion"
                      value={ratingValue}
                      onClick={() => {
                        setRating(ratingValue);
                        setValue('calificacion', ratingValue);
                      }}
                      style={{ display: 'none' }}
                    />
                    <FaStar
                      size={35}
                      style={styles.star}
                      color={ratingValue <= (hover || rating) ? '#ffc107' : '#4a5d50'}
                      onMouseEnter={() => setHover(ratingValue)}
                      onMouseLeave={() => setHover(0)}
                    />
                  </label>
                );
              })}
            </div>

            {rating === 0 && (
              <div className="text-danger small mt-2" style={{ fontSize: '0.875em' }}>
                * Selecciona una calificación
              </div>
            )}
          </Form.Group>
          <Form.Group className="mb-3" controlId="formComentario">
            <Form.Label>Comentario</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              placeholder="Escribe tu opinión..."
              style={styles.input}
              // 👇 Activa el borde rojo
              isInvalid={!!errors.comentario}
              {...register('comentario', {
                required: 'El comentario es obligatorio',
                minLength: { value: 5, message: 'Mínimo 5 caracteres' },
                maxLength: { value: 300, message: 'Máximo 300 caracteres' },
                pattern: {
                  value: /^[a-zA-Z0-9\s.,!?]+$/,
                  message: 'Solo letras, números y puntuación básica (.,!?)',
                },
              })}
            />
            {/* 👇 Mensaje de error */}
            <Form.Control.Feedback type="invalid">
              {errors.comentario?.message}
            </Form.Control.Feedback>
          </Form.Group>

          <div className="d-flex justify-content-end gap-2 mt-4">
            <Button style={styles.btnSecondary} onClick={handleClose}>
              Cancelar
            </Button>
            <Button style={styles.btnPrimary} type="submit" disabled={rating === 0}>
              Enviar Reseña
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default CrearReseniaModal;
