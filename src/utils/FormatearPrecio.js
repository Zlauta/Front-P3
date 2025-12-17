export const formatearDinero = (cantidad) => {
  const numero = Number(cantidad) || 0;

  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(numero);
};
