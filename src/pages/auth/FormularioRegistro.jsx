import React from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { registrarUsuario } from '@/service/usuario.service.js';
import emailjs from '@emailjs/browser';
import {
  reglasEmail,
  reglasContrasenia,
  reglasNombre,
  reglasTelefono,
} from '@/utils/validaciones.js';

const FormularioRegistro = ({ fromAdmin = false }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      userName: '',
      email: '',
      password: '',
      confirmPassword: '',
      telefono: '',
    },
  });

  const navegate = useNavigate();

  const handleCancel = () => {
    if (fromAdmin) {
      navegate('/admin');
    } else {
      navegate('/');
    }
  };

  async function onSubmit(data) {
    try {
      if (data.password !== data.confirmPassword) {
        Swal.fire({
          icon: 'error',
          title: 'Las contraseñas deben ser iguales!',
          text: 'Intentá nuevamente',
          iconColor: '#1aaf4b',
          confirmButtonColor: '#1aaf4b',
          cancelButtonColor: '#254630',
          customClass: { popup: 'small-alert' },
        });
        return;
      }

      const nuevoUsuario = {
        nombre: data.userName,
        email: data.email.toLowerCase(),
        contrasenia: data.password,
        telefono: data.telefono,
        createdAt: new Date().toISOString(),
        rol: 'cliente',
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
        .catch((err) => {
          console.error('Error al enviar el correo', err);
        });

      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'Usuario registrado correctamente',
        showConfirmButton: false,
        iconColor: '#1aaf4b',
        confirmButtonColor: '#1aaf4b',
        cancelButtonColor: '#254630',
        customClass: { popup: 'small-alert' },
        timer: 1500,
      });

      reset();
      if (fromAdmin) {
        navegate('/admin');
      } else {
        navegate('/');
      }
    } catch (error) {
      const backendMsg = error.response?.data?.errors?.[0]?.message || 'Error al registrar usuario';
      Swal.fire({
        title: backendMsg,
        icon: 'error',
        iconColor: '#1aaf4b',
        confirmButtonColor: '#1aaf4b',
        cancelButtonColor: '#254630',
        customClass: { popup: 'small-alert' },
      });
      console.error(error);
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
          {...register('userName', reglasNombre)}
        />
        <Form.Control.Feedback type="invalid">{errors.userName?.message}</Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="label mb-3" controlId="formBasicEmail">
        <Form.Label>Correo electronico</Form.Label>
        <Form.Control
          type="email"
          placeholder="Ingrese su correo electronico"
          isInvalid={errors.email}
          {...register('email', reglasEmail)}
        />
        <Form.Control.Feedback type="invalid">{errors.email?.message}</Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="label mb-3" controlId="formBasicPassword">
        <Form.Label>Contraseña</Form.Label>
        <Form.Control
          type="password"
          placeholder="Ingrese su contraseña"
          isInvalid={errors.password}
          {...register('password', reglasContrasenia)}
        />
        <Form.Control.Feedback type="invalid">{errors.password?.message}</Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="label mb-3" controlId="formConfirmPassword">
        <Form.Label>Confirmar contraseña</Form.Label>
        <Form.Control
          type="password"
          placeholder="Confirme su contraseña"
          isInvalid={errors.confirmPassword}
          {...register('confirmPassword', reglasContrasenia)}
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
          {...register('telefono', reglasTelefono)}
        />
        <Form.Control.Feedback type="invalid">{errors.telefono?.message}</Form.Control.Feedback>
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
