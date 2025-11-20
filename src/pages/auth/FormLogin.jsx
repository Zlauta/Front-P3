import React from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../service/auth.service";

const formLogin = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isValid },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const navigate = useNavigate();

  const handleGoRegister = () => {
    navigate("/register");
  };

  async function onSubmit(data) {
    try {
      const response = await loginUser(data);

      if (response.payload.estado !== "activo") {
        Swal.fire({
          title: "Usuario inactivo",
          text: "Consulte al administrador",
          icon: "warning",
          confirmButtonColor: "#254630",
        }).then(() => {
          navigate("/");
        });
        return;
      }

      Swal.fire({
        title: response.msg,
        icon: "success",
        confirmButtonColor: "#1aaf4b",
      });

      reset();
      navigate("/");
    } catch (error) {
      Swal.fire({
        title: "Error en el login",
        text: error.msg || "Verifique sus credenciales",
        icon: "error",
        confirmButtonColor: "#254630",
      });
    }
  }

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Form.Group className="label mb-3" controlId="formBasicEmail">
        <Form.Label>Correo electrónico</Form.Label>
        <Form.Control
          type="email"
          placeholder="Ingrese su email"
          isInvalid={errors.email}
          {...register("email", {
            required: "El email es requerido",
            // Esta expresion regular evalua que sea un email valido
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Debe ingresar un email válido",
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
            required: "El password es requerido",
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
      <div className="text-center mt-5 d-flex flex-column justify-content-center gap-2 flex-md-row">
        <Button className="forms-boton mt-3" type="submit">
          Iniciar Sesion
        </Button>

        <Button className="forms-boton mt-3" onClick={handleGoRegister}>
          <>Registrarse</>
        </Button>
      </div>
      x``
    </Form>
  );
};

export default formLogin;
