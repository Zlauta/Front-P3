import React, { useCallback, useState } from "react";
import { Modal, Button, Form, Spinner } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { actualizarProducto } from "../../../service/producto.service.js";
import { useDropzone } from "react-dropzone";
import {
  deleteImageByURL,
  uploadImageAndGetURL,
} from "../../../service/almacenamiento.service.js";

const EditarMenuModal = ({ show, onHide, menu, onUpdated }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    mode: "onChange",
    defaultValues: {
      nombre: menu?.nombre ?? "",
      descripcion: menu?.descripcion ?? "",
      precio: menu?.precio ?? 0,
      categoria: menu?.categoria ?? "",
    },
  });

  const [newImage, setNewImage] = useState(null);
  const [preview, setPreview] = useState(menu?.imagen || null);

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      setNewImage(file);
      setPreview(URL.createObjectURL(file));
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    multiple: false,
  });

  const onSubmit = async (data) => {
    try {
      let imageURL = menu?.imagen;

      if (newImage) {
        if (menu?.imagen) await deleteImageByURL(menu.imagen);
        imageURL = await uploadImageAndGetURL(newImage, "productos");
      }

      const updatedMenu = {
        ...menu,
        ...data,
        precio: parseFloat(data.precio),
        imagen: imageURL,
      };

      const result = await actualizarProducto(menu._id, updatedMenu);
      toast.success("Menú actualizado correctamente");

      onUpdated(result);
      onHide();
      reset();
    } catch (error) {
      console.error(error);
      toast.error("No se pudo actualizar el menú");
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered backdrop="static">
      <Form
        noValidate
        onSubmit={handleSubmit(onSubmit)}
        style={{ background: "#254630" }}
      >
        <Modal.Header closeButton>
          <Modal.Title style={{ color: "#fff" }}>Editar Menú</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3" controlId="nombre">
            <Form.Label className=" text-light">Nombre del producto</Form.Label>
            <Form.Control
              type="text"
              placeholder="Ej: Pizza Napolitana"
              isInvalid={!!errors.nombre}
              {...register("nombre", {
                required: "El nombre es obligatorio",
                minLength: {
                  value: 2,
                  message: "El nombre debe tener entre 2 y 50 caracteres",
                },
                maxLength: {
                  value: 50,
                  message: "El nombre debe tener entre 2 y 50 caracteres",
                },
                pattern: {
                  value: /^[a-zA-ZñÑáéíóúÁÉÍÓÚüÜ0-9\s]+$/,
                  message:
                    "El nombre solo puede contener letras, números, espacios y caracteres en español",
                },
              })}
            />
            <Form.Control.Feedback type="invalid">
              {errors.nombre?.message}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="descripcion">
            <Form.Label className=" text-light">Descripción</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Describe el menú..."
              isInvalid={!!errors.descripcion}
              {...register("descripcion", {
                required: "La descripción es obligatoria",
                minLength: {
                  value: 10,
                  message:
                    "Debe ingresar una descripción entre 10 y 100 caracteres",
                },
                maxLength: {
                  value: 100,
                  message:
                    "Debe ingresar una descripción entre 10 y 100 caracteres",
                },
                pattern: {
                  value: /^[a-zA-ZÀ-ÿ0-9.,;:¡!¿?\-()'"%°\s]{10,100}$/u,
                  message:
                    "La descripción solo puede contener letras, números y espacios",
                },
              })}
            />
            <Form.Control.Feedback type="invalid">
              {errors.descripcion?.message}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="precio">
            <Form.Label className=" text-light">Precio ($)</Form.Label>
            <Form.Control
              type="number"
              step="0.01"
              min="0"
              placeholder="Ej: 1200"
              isInvalid={!!errors.precio}
              {...register("precio", {
                required: "El precio es obligatorio",
                pattern: {
                  value: /^\d+(\.\d{1,2})?$/,
                  message:
                    "El precio debe ser un número válido con hasta 2 decimales",
                },
                validate: (value) => {
                  const num = parseFloat(value);
                  if (isNaN(num) || num < 0) {
                    return "Debe ingresar un número válido para el precio";
                  }
                  if (num > 1000000) {
                    return "El precio no puede ser mayor a $1.000.000";
                  }
                  return true;
                },
              })}
            />
            <Form.Control.Feedback type="invalid">
              {errors.precio?.message}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="categoria">
            <Form.Label className=" text-light">Categoría</Form.Label>
            <Form.Select
              isInvalid={!!errors.categoria}
              {...register("categoria", {
                required: "La categoría es obligatoria",
                validate: (value) =>
                  ["entrada", "principal", "bebida", "postre"].includes(
                    value
                  ) ||
                  "La categoría debe ser 'entrada','principal', 'bebida' o 'postre'",
              })}
            >
              <option value="">Seleccionar categoría</option>
              <option value="entrada">Entrada</option>
              <option value="principal">Principal</option>
              <option value="bebida">Bebida</option>
              <option value="postre">Postre</option>
            </Form.Select>
            <Form.Control.Feedback type="invalid">
              {errors.categoria?.message}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className=" text-light">Imagen del menú</Form.Label>
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
              <input {...getInputProps()} accept="image/*" />
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
            {errors.imagen && (
              <div className="invalid-feedback d-block">
                {errors.imagen.message}
              </div>
            )}
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="success"
            disabled={isSubmitting}
            style={{ backgroundColor: "#1aaf4b", border: "none" }}
          >
            {isSubmitting ? (
              <>
                <Spinner animation="border" size="sm" /> Guardando...
              </>
            ) : (
              "Guardar cambios"
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default EditarMenuModal;
