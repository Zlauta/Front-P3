// src/utils/reservaHelpers.js

// Convierte "14:30" a 870 (minutos)
export const convertirAMinutos = (horaString) => {
  if (!horaString) return 0;
  const [horas, minutos] = horaString.split(':').map(Number);
  return horas * 60 + minutos;
};

// Formatea ISO a fecha legible (DD/MM/YYYY)
export const formatearFecha = (isoString) => {
  return isoString ? new Date(isoString).toLocaleDateString('es-ES', { timeZone: 'UTC' }) : '';
};

// Valida capacidad según reglas del negocio
export const validarCapacidadMesa = (mesa, personas) => {
  const mesaInt = parseInt(mesa);
  const personasInt = parseInt(personas);

  if (!mesaInt || !personasInt) return null; // Aún no escribe
  if (personasInt > 10) return 'Para más de 10 personas, contactar por teléfono.';
  if (mesaInt <= 10 && personasInt > 2) return `Mesa ${mesaInt} es chica (máx 2per).`;
  if (mesaInt > 10 && mesaInt <= 20 && personasInt > 4) return `Mesa ${mesaInt} es estándar (máx 4per).`;
  if (mesaInt > 20 && mesaInt <= 25 && personasInt > 6) return `Mesa ${mesaInt} es mediana (máx 6per).`;
  if (mesaInt > 30) return 'Número de mesa inválido.';
  
  return null; // Null significa que NO hay error (es válido)
};

// Valida rangos horarios
export const validarHorarioAtencion = (hora) => {
  const minutos = convertirAMinutos(hora);
  const turnoMañana = minutos >= 600 && minutos <= 960;    // 10:00 - 16:00
  const turnoNoche = minutos >= 1260 && minutos <= 1439;   // 21:00 - 23:59
  const turnoMadrugada = minutos >= 0 && minutos <= 120;   // 00:00 - 02:00

  if (!turnoMañana && !turnoNoche && !turnoMadrugada) {
    return 'Cerrado. Horarios: 10-16hs y 21-02hs';
  }
  return null;
};

// Valida conflicto de horarios (Cruces de reserva)
export const validarConflictoReserva = (datosNuevos, listaReservas, idReservaActual = null) => {
  const { fecha, hora, mesa } = datosNuevos;
  const minutosNuevos = convertirAMinutos(hora);

  const existeConflicto = listaReservas.find((reserva) => {
    // Si estamos editando, ignoramos la reserva propia
    if (idReservaActual && reserva._id === idReservaActual) return false;

    // Normalizamos fecha para comparar strings YYYY-MM-DD
    const fechaReservaExistente = new Date(reserva.fecha).toISOString().split('T')[0];
    
    // Si no es la misma fecha ni la misma mesa, no hay conflicto
    if (fechaReservaExistente !== fecha || String(reserva.mesa) !== String(mesa)) return false;

    // Verificar choque de horas (margen de 2hs / 120 min)
    const minutosExistentes = convertirAMinutos(reserva.hora);
    const diferencia = Math.abs(minutosNuevos - minutosExistentes);
    
    return diferencia < 120; 
  });

  if (existeConflicto) return `Mesa ${mesa} ocupada en ese horario (margen de 2hs).`;
  return null;
};