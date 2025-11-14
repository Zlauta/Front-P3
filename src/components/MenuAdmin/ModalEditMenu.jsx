import React, { useCallback, useState } from "react";
import { Modal, Button, Form, Spinner } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { actualizarProducto } from "../../service/products.service.js";
import { useDropzone } from "react-dropzone";
import { deleteImageByURL, uploadImageAndGetURL } from "../../service/storage.service.js";

const ModalEditMenu = ({ show, onHide, menu, onUpdated }) => {
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
      reset()
    } catch (error) {
      console.error(error);
      toast.error("No se pudo actualizar el menú");
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered backdrop="static">
      <Form noValidate onSubmit={handleSubmit(onSubmit)} style={{background:"#254630"}}>
        <Modal.Header closeButton>
          <Modal.Title style={{color:"#fff"}}>Editar Menú</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label style={{color:"#fff"}}>Nombre</Form.Label>
            <Form.Control
              type="text"
              placeholder="Ej: Milanesa con papas"
              isInvalid={!!errors.nombre}
              {...register("nombre", {
                required: "El nombre es obligatorio",
                minLength: { value: 3, message: "Debe tener al menos 3 caracteres" },
              })}
            />
            <Form.Control.Feedback type="invalid">
              {errors.nombre?.message}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label style={{color:"#fff"}}>Descripción</Form.Label>
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

          <Form.Group className="mb-3">
            <Form.Label style={{color:"#fff"}}>Precio ($)</Form.Label>
            <Form.Control
              type="number"
              step="0.01"
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

          <Form.Group className="mb-3">
            <Form.Label style={{color:"#fff"}}>Categoría</Form.Label>
            <Form.Select
              isInvalid={!!errors.categoria}
              {...register("categoria", { required: "Selecciona una categoría" })}
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

          <Form.Group>
            <Form.Label style={{color:"#fff"}}>Imagen</Form.Label>
            <div
              {...getRootProps()}
              style={{
                border: "2px dashed #1aaf4b",
                borderRadius: "10px",
                padding: "20px",
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
                    height: "180px",
                    objectFit: "cover",
                    borderRadius: "10px",
                  }}
                />
              ) : (
                <p style={{ color: "#fff" }}>
                  Arrastra o haz clic para seleccionar una nueva imagen
                </p>
              )}
            </div>
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

export default ModalEditMenu;