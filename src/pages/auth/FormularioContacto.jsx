import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { crearContacto } from '@/service/contacto.service.js';
import emailjs from '@emailjs/browser';
import { reglasEmail, reglasNombre, reglasMensaje, reglasTelefono } from '@/utils/validaciones.js';

const FormularioContacto = ({ usuario }) => {
  const isLogged = !!usuario;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      nombreContacto: isLogged ? usuario?.nombre : '',
      email: isLogged ? usuario?.email : '',
      telefono: '',
      mensajeContacto: '',
    },
  });

  const navegate = useNavigate();

  const handleCancel = () => {
    navegate('/');
  };

  async function onSubmit(data) {
    const nuevoContacto = {
      nombre: data.nombreContacto,
      email: data.email.toLowerCase(),
      telefono: data.telefono,
      mensaje: data.mensajeContacto,
      estado: 'pendiente',
    };
    try {
      await crearContacto(nuevoContacto);
      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'Gracias por contactarte con nosotros!',
        showConfirmButton: false,
        iconColor: '#1aaf4b',
        confirmButtonColor: '#1aaf4b',
        cancelButtonColor: '#254630',
        customClass: { popup: 'small-alert' },
        timer: 1500,
      });
    } catch (error) {
      Swal.fire({
        title: 'Error al enviar el mensaje',
        icon: 'error',
        iconColor: '#1aaf4b',
        confirmButtonColor: '#1aaf4b',
        cancelButtonColor: '#254630',
        customClass: { popup: 'small-alert' },
      });
      return;
    }
    try {
      const response = await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_CONTACT,
        {
          user_name: data.nombreContacto,
          to_email: data.email,
          message: data.mensajeContacto,
          created_at: new Date().toLocaleString(),
        },
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      );
    } catch (error) {
      Swal.fire({
        title: 'Tu consulta fue registrada, pero no se pudo enviar el correo',
        icon: 'warning',
        iconColor: '#1aaf4b',
        confirmButtonColor: '#1aaf4b',
        cancelButtonColor: '#254630',
        customClass: { popup: 'small-alert' },
      });
    }
    reset();
    navegate('/');
  }

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Form.Group className="label mb-3" controlId="formNombreContacto">
        <Form.Label>Nombre de Usuario</Form.Label>
        <Form.Control
          type="text"
          placeholder="Nombre de usuario"
          isInvalid={errors.nombreContacto}
          readOnly={isLogged}
          {...register('nombreContacto', reglasNombre)}
        />
        <Form.Control.Feedback type="invalid">
          {errors.nombreContacto?.message}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="label mb-3" controlId="formBasicEmail">
        <Form.Label>Correo electronico</Form.Label>
        <Form.Control
          type="email"
          placeholder="Ingrese su correo electronico"
          isInvalid={errors.email}
          readOnly={isLogged}
          {...register('email', reglasEmail)}
        />
        <Form.Control.Feedback type="invalid">{errors.email?.message}</Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="label mb-3" controlId="formBasicMensaje">
        <Form.Label>Escribinos tu mensaje</Form.Label>
        <Form.Control
          as="textarea"
          rows={4}
          placeholder="Ingrese su mensaje"
          isInvalid={errors.mensajeContacto}
          {...register('mensajeContacto', reglasMensaje)}
        />
        <Form.Control.Feedback type="invalid">
          {errors.mensajeContacto?.message}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="label mb-3" controlId="formBasicTelefono">
        <Form.Label>Teléfono</Form.Label>
        <Form.Control
          type="tel"
          placeholder="Ingrese su número de teléfono"
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

export default FormularioContacto;
