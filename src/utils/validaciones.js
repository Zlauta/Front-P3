export const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const REGEX_CONTRASENIA =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=\[\]{};':"\\|,.<>\/?]).{8,}$/;

export const REGEX_NOMBRE = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s'-]+$/;

export const REGEX_MENSAJE = /^[a-zA-ZÀ-ÿ0-9.,;:¡!¿?\-()'"%°\s]{5,500}$/u;

export const REGEX_TELEFONO = /^\+?[1-9]\d{7,14}$/;

export const reglasEmail = {
  required: 'El correo electrónico es requerido',
  pattern: {
    value: REGEX_EMAIL,
    message:
      'El correo electrónico debe tener texto antes de la @ y, después de @, debe tener texto y . seguido de texto',
  },
};

export const reglasContrasenia = {
  required: 'La contraseña es requerida',
  pattern: {
    value: REGEX_CONTRASENIA,
    message:
      'La contraseña debe tener al menos 8 caracteres, incluir una mayúscula, una minúscula, un número y un carácter especial.',
  },
};

export const reglasNombre = {
  required: 'El nombre de usuario es requerido',
  pattern: {
    value: REGEX_NOMBRE,
    message: 'Solo se permiten letras',
  },
  maxLength: {
    value: 50,
    message: 'El nombre no puede tener más de 50 caracteres',
  },
  minLength: {
    value: 2,
    message: 'El nombre debe tener al menos 2 caracteres',
  },
};

export const reglasMensaje = {
  required: 'El mensaje es obligatorio',
  minLength: {
    value: 5,
    message: 'El mensaje debe tener al menos 5 caracteres',
  },
  maxLength: {
    value: 500,
    message: 'El mensaje no puede superar los 500 caracteres',
  },
  pattern: {
    value: REGEX_MENSAJE,
    message: 'El mensaje contiene caracteres no permitidos',
  },
};

export const reglasTelefono = {
  required: 'El teléfono es un campo requerido',
  pattern: {
    value: REGEX_TELEFONO,
    message:
      'El número de teléfono debe tener entre 8 y 15 dígitos, puede comenzar con “+” y no debe iniciar con 0.',
  },
};
