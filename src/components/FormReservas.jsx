import { useState, useEffect } from "react";

export default function FormReserva() {
  const [minDate, setMinDate] = useState("");
  const [minTime, setMinTime] = useState("");

  const [form, setForm] = useState({
    usuario: "",
    usuarioEmail: "",
    mesa: "",
    cantidadPersonas: "",
    fecha: "",
    hora: "",
    notas: "",
  });

  // 🔹 Cargar usuario desde sessionStorage
  useEffect(() => {
    const nombre = sessionStorage.getItem("nombre") || "";
    const email = sessionStorage.getItem("email") || "";

    setForm((prev) => ({
      ...prev,
      usuario: nombre,
      usuarioEmail: email,
    }));
  }, []);

  // 🔹 Configurar fecha mínima (hoy)
  useEffect(() => {
    const hoy = new Date();
    const yyyy = hoy.getFullYear();
    const mm = String(hoy.getMonth() + 1).padStart(2, "0");
    const dd = String(hoy.getDate()).padStart(2, "0");

    setMinDate(`${yyyy}-${mm}-${dd}`);
  }, []);

  // 🔹 Actualizar hora mínima si la fecha es hoy
  useEffect(() => {
    if (!form.fecha) return;

    const hoy = new Date();
    const fechaElegida = new Date(form.fecha + "T00:00");

    if (fechaElegida.toDateString() === hoy.toDateString()) {
      const hh = String(hoy.getHours()).padStart(2, "0");
      const mm = String(hoy.getMinutes()).padStart(2, "0");
      setMinTime(`${hh}:${mm}`);
    } else {
      setMinTime(""); // otra fecha → sin límite
    }
  }, [form.fecha]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ❌ Validación adicional en front
    if (form.fecha < minDate) {
      alert("La fecha no puede ser pasada.");
      return;
    }

    if (form.fecha === minDate && form.hora < minTime) {
      alert("La hora no puede ser del pasado.");
      return;
    }

    try {
      const res = await fetch("http://localhost:3000/api/reservas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Error al crear la reserva");
        return;
      }

      alert("Reserva creada con éxito");

      setForm({
        usuario: sessionStorage.getItem("nombre") || "",
        usuarioEmail: sessionStorage.getItem("email") || "",
        mesa: "",
        cantidadPersonas: "",
        fecha: "",
        hora: "",
        notas: "",
      });
    } catch (error) {
      console.error("Error al enviar la reserva:", error);
      alert("Hubo un problema al conectar con el servidor");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        backgroundColor: "rgba(255, 255, 255, 0.12)",
        backdropFilter: "blur(6px)",
        padding: "20px",
        borderRadius: "12px",
        width: "100%",
        maxWidth: "380px",
        margin: "0 auto",
        color: "#f5f5f5",
      }}
    >
      <h3 className="mb-3 text-center">Nueva Reserva</h3>

      {/* Usuario */}
      <div className="mb-3">
        <label className="form-label">Nombre</label>
        <input
          type="text"
          className="form-control"
          name="usuario"
          value={form.usuario}
          readOnly
        />
      </div>

      {/* Email */}
      <div className="mb-3">
        <label className="form-label">Email</label>
        <input
          type="email"
          className="form-control"
          name="usuarioEmail"
          value={form.usuarioEmail}
          readOnly
        />
      </div>

      {/* Mesa */}
      <div className="mb-3">
        <label className="form-label">Mesa</label>
        <input
          type="number"
          min="1"
          className="form-control"
          name="mesa"
          value={form.mesa}
          onChange={handleChange}
        />
      </div>

      {/* Personas */}
      <div className="mb-3">
        <label className="form-label">Cantidad de Personas</label>
        <input
          type="number"
          min="1"
          className="form-control"
          name="cantidadPersonas"
          value={form.cantidadPersonas}
          onChange={handleChange}
        />
      </div>

      {/* Fecha con restricción */}
      <div className="mb-3">
        <label className="form-label">Fecha</label>
        <input
          type="date"
          className="form-control"
          name="fecha"
          value={form.fecha}
          min={minDate}
          onChange={handleChange}
        />
      </div>

      {/* Hora con restricción dinámica */}
      <div className="mb-3">
        <label className="form-label">Hora</label>
        <input
          type="time"
          className="form-control"
          name="hora"
          value={form.hora}
          min={minTime}
          onChange={handleChange}
        />
      </div>

      {/* Notas */}
      <div className="mb-3">
        <label className="form-label">Notas</label>
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
