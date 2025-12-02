import React from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import {
  obtenerUsuarios,
  registrarUsuario,
} from "../../service/usuario.service.js";
import emailjs from "@emailjs/browser";

const FormularioRegistro = ({ fromAdmin = false }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isValid },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      userName: "",
      email: "",
      password: "",
      confirmPassword: "",
      telefono: "",
    },
  });

  const navegate = useNavigate();

  const handleCancel = () => {
    // si viene del admin, cancelar vuelve al admin
    if (fromAdmin) {
      navegate("/admin");
    } else {
      navegate("/");
    }
  };

  const navegacion = useNavigate();

  async function onSubmit(data) {
    try {
      const usuariosDeLaDb = await obtenerUsuarios();
      const usuarioExistente = usuariosDeLaDb.find(
        (usuario) => usuario.email === data.email
      );
      console.log(usuarioExistente);

      if (usuarioExistente) {
        Swal.fire({
          icon: "error",
          title: "Ingresá otro correo electrónico...",
          text: "El usuario ya existe en la base de datos",
          iconColor: "#1aaf4b",
          confirmButtonColor: "#1aaf4b",
          cancelButtonColor: "#254630",
          customClass: { popup: "small-alert" },
        });
        reset();
        if (fromAdmin) {
          navegate("/admin");
        } else {
          navegate("/");
        }
        return;
      }

      if (data.password !== data.confirmPassword) {
        Swal.fire({
          icon: "error",
          title: "Las contraseñas deben ser iguales!",
          text: "Intentá nuevamente",
          iconColor: "#1aaf4b",
          confirmButtonColor: "#1aaf4b",
          cancelButtonColor: "#254630",
          customClass: { popup: "small-alert" },
        });
        return;
      }

      const nuevoUsuario = {
        nombre: data.userName,
        email: data.email.toLowerCase(),
        contrasenia: data.password,
        telefono: data.telefono,
        createdAt: new Date().toISOString(),
        rol: "cliente",
      };

      await registrarUsuario(nuevoUsuario);

      emailjs
        .send(
          import.meta.env.VITE_EMAILJS_SERVICE_ID,
          import.meta.env.VITE_EMAILJS_TEMPLATE_REGISTER,
          {
            user_name: data.userName,
            to_email: data.email,
            created_at: new Date().toLocaleString(),
          },
          import.meta.env.VITE_EMAILJS_PUBLIC_KEY
        )
        .then((response) => {
          console.log(
            "Correo enviado con éxito",
            response.status,
            response.text
          );
        })
        .catch((err) => {
          console.error("Error al enviar el correo", err);
        });

      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Usuario registrado correctamente",
        showConfirmButton: false,
        iconColor: "#1aaf4b",
        confirmButtonColor: "#1aaf4b",
        cancelButtonColor: "#254630",
        customClass: { popup: "small-alert" },
        timer: 1500,
      });

      reset();
      if (fromAdmin) {
        navegate("/admin");
      } else {
        navegate("/");
      }
    } catch (error) {
      Swal.fire({
        title: "Error al registrar usuario",
        icon: "error",
        iconColor: "#1aaf4b",
        confirmButtonColor: "#1aaf4b",
        cancelButtonColor: "#254630",
        customClass: { popup: "small-alert" },
      });
      console.log(error);
    }
  }

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Form.Group className="label mb-3" controlId="formUserName">
        <Form.Label>Nombre de Usuario</Form.Label>
        <Form.Control
          type="text"
          placeholder="Nombre de usuario"
          isInvalid={errors.userName}
          {...register("userName", {
            required: "El nombre de usuario es requerido",

            pattern: {
              value: /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s'-]+$/,
              message: "Solo se permiten letras",
            },
            maxLength: {
              value: 50,
              message: "El nombre no puede tener más de 50 caracteres",
            },

            minLength: {
              value: 2,
              message:
                "El nombre debe tener al menos 2 caracteres message. Solo se permiten letras.",
            },
          })}
        />
        <Form.Control.Feedback type="invalid">
          {errors.userName?.message}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="label mb-3" controlId="formBasicEmail">
        <Form.Label>Correo electronico</Form.Label>
        <Form.Control
          type="email"
          placeholder="Ingrese su correo electronico"
          isInvalid={errors.email}
          {...register("email", {
            required: "El correo electronico es requerido",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message:
                "El correo electronico debe tener texto antes de la @ y, despues de  @,  debe tener texto y . seguido de texto",
            },
          })}
        />
        <Form.Control.Feedback type="invalid">
          {errors.email?.message}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="label mb-3" controlId="formBasicPassword">
        <Form.Label>Contraseña</Form.Label>
        <Form.Control
          type="password"
          placeholder="Ingrese su contraseña"
          isInvalid={errors.password}
          {...register("password", {
            required: "La contraseñia es un campo requerido",
            pattern: {
              value:
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=\[\]{};':"\\|,.<>\/?]).{8,}$/,
              message:
                "La contraseña debe tener al menos 8 caracteres, incluir una mayúscula, una minúscula, un número y un carácter especial.",
            },
          })}
        />
        <Form.Control.Feedback type="invalid">
          {errors.password?.message}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="label mb-3" controlId="formConfirmPassword">
        <Form.Label>Confirmar contraseña</Form.Label>
        <Form.Control
          type="password"
          placeholder="Confirme su contraseña"
          isInvalid={errors.confirmPassword}
          {...register("confirmPassword", {
            required: "Confirmar la contraseña es requerido",
            pattern: {
              value:
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=\[\]{};':"\\|,.<>\/?]).{8,}$/,
              message:
                "La contraseña debe tener al menos 8 caracteres, incluir una mayúscula, una minúscula, un número y un carácter especial.",
            },
          })}
        />
        <Form.Control.Feedback type="invalid">
          {errors.confirmPassword?.message}
        </Form.Control.Feedback>
      </Form.Group>
      <Form.Group className="label mb-3" controlId="formBasicTelefono">
        <Form.Label>Teléfono</Form.Label>
        <Form.Control
          type="tel"
          placeholder="Ingrese su número de teléfono: ej +5493811234567"
          isInvalid={errors.telefono}
          {...register("telefono", {
            required: "El teléfono es un campo requerido",
            pattern: {
              value: /^\+?[1-9]\d{7,14}$/,

              message:
                "El número de teléfono debe tener entre 8 y 15 dígitos, puede comenzar con “+” y no debe iniciar con 0.",
            },
          })}
        />
        <Form.Control.Feedback type="invalid">
          {errors.telefono?.message}
        </Form.Control.Feedback>
      </Form.Group>

      <div className="text-center mt-5 d-flex flex-column justify-content-center gap-2 flex-md-row">
        <Button className="forms-boton " type="submit">
          Enviar
        </Button>

        <Button className="forms-boton" onClick={handleCancel}>
          <>Cancelar</>
        </Button>
      </div>
    </Form>
  );
};

export default FormularioRegistro;
