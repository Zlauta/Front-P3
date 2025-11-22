import FormReserva from "../../components/FormReservas";

export default function Reservas() {
  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "40px",
      }}
      className="d-flex justify-content-center align-items-start"
    >
      <FormReserva />
    </div>
  );
}
