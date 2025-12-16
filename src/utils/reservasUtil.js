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

// Valida capacidad según reglas del negocio (Retorna null si es válido, string si error)
export const validarCapacidadMesa = (mesa, personas) => {
  const mesasInt = parseInt(mesa);
  const personasInt = parseInt(personas);

  if (!mesasInt || !personasInt) return null; // Aún no escribe
  if (personasInt > 10) return 'Para más de 10 personas, contactar por teléfono.';
  if (mesasInt <= 10 && personasInt > 2) return `Mesa ${mesasInt} es chica (máx 2per).`;
  if (mesasInt > 10 && mesasInt <= 20 && personasInt > 4) return `Mesa ${mesasInt} es estándar (máx 4per).`;
  if (mesasInt > 20 && mesasInt <= 25 && personasInt > 6) return `Mesa ${mesasInt} es mediana (máx 6per).`;
  if (mesasInt > 30) return 'Número de mesa inválido.';
  
  return null; // Null significa que es válido
};

// Nueva función: Genera lista de mesas válidas
export const obtenerMesasDisponibles = (cantidadPersonas) => {
  if (!cantidadPersonas) return [];
  const personasInt = parseInt(cantidadPersonas);
  const mesasValidas = [];

  for (let mesasInt = 1; mesasInt <= 30; mesasInt++) {
    const error = validarCapacidadMesa(mesasInt, personasInt);
    if (!error) { 
      mesasValidas.push(mesasInt);
    }
  }
  return mesasValidas;
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
    if (idReservaActual && reserva._id === idReservaActual) return false;
    const fechaReservaExistente = new Date(reserva.fecha).toISOString().split('T')[0];
    if (fechaReservaExistente !== fecha || String(reserva.mesa) !== String(mesa)) return false;
    const minutosExistentes = convertirAMinutos(reserva.hora);
    const diferencia = Math.abs(minutosNuevos - minutosExistentes);
    return diferencia < 120; 
  });

  if (existeConflicto) return `Mesa ${mesa} ocupada en ese horario (margen de 2hs).`;
  return null;
};