import { useState } from "react";

export default function FormReserva() {
  const [form, setForm] = useState({
    usuario: "",
    mesa: "",
    cantidadPersonas: "",
    fecha: "",
    hora: "",
    notas: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Datos enviados:", form);
    // Aquí va tu fetch al backend
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        backgroundColor: "rgba(255, 255, 255, 0.12)",
        backdropFilter: "blur(6px)",
        padding: "25px",
        borderRadius: "12px",
        minWidth: "380px",
        color: "#f5f5f5",
      }}
    >
      <h3 className="mb-3 text-center">Nueva Reserva</h3>

      {/* Usuario */}
      <div className="mb-3">
        <label className="form-label">ID del Usuario</label>
        <input
          type="text"
          className="form-control"
          name="usuario"
          value={form.usuario}
          onChange={handleChange}
        />
      </div>

      {/* Mesa */}
      <div className="mb-3">
        <label className="form-label">Mesa</label>
        <input
          type="number"
          className="form-control"
          name="mesa"
          value={form.mesa}
          onChange={handleChange}
        />
      </div>

      {/* Cantidad Personas */}
      <div className="mb-3">
        <label className="form-label">Cantidad de Personas</label>
        <input
          type="number"
          className="form-control"
          name="cantidadPersonas"
          value={form.cantidadPersonas}
          onChange={handleChange}
        />
      </div>

      {/* Fecha */}
      <div className="mb-3">
        <label className="form-label">Fecha</label>
        <input
          type="date"
          className="form-control"
          name="fecha"
          value={form.fecha}
          onChange={handleChange}
        />
      </div>

      {/* Hora */}
      <div className="mb-3">
        <label className="form-label">Hora</label>
        <input
          type="time"
          className="form-control"
          name="hora"
          value={form.hora}
          onChange={handleChange}
        />
      </div>

      {/* Notas */}
      <div className="mb-3">
        <label className="form-label">Notas (opcional)</label>
        <textarea
          className="form-control"
          name="notas"
          rows="3"
          value={form.notas}
          onChange={handleChange}
        />
      </div>

      <button type="submit" className="btn btn-primary w-100">
        Crear Reserva
      </button>
    </form>
  );
}
