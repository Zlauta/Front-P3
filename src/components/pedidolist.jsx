import React, { useState } from "react";

const PedidoList = ({ pedidos = [], onActualizar }) => {
  const [filtro, setFiltro] = useState("todos");

  const filtrarPedidos = () => {
    if (filtro === "todos") return pedidos;
    return pedidos.filter((p) => p.estado === filtro);
  };

  const pedidosFiltrados = filtrarPedidos();

  return (
    <div className="bg-white p-4 shadow-md rounded-lg max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Lista de Pedidos</h2>

      <div className="flex gap-2 mb-4">
        {["todos", "pendiente", "en proceso", "entregado"].map((est) => (
          <button
            key={est}
            className={`px-3 py-1 rounded border ${filtro === est ? "bg-blue-600 text-white" : "bg-gray-200"
              }`}
            onClick={() => setFiltro(est)}
          >
            {est.charAt(0).toUpperCase() + est.slice(1)}
          </button>
        ))}
      </div>

      {pedidosFiltrados.length === 0 ? (
        <p>No hay pedidos en este estado.</p>
      ) : (
        <ul className="space-y-3">
          {pedidosFiltrados.map((p) => (
            <li key={p._id} className="p-3 bg-gray-100 rounded flex justify-between items-center">
              <div>
                <p><strong>Cliente:</strong> {p.cliente}</p>
                <p><strong>Producto:</strong> {p.producto}</p>
                <p><strong>Cantidad:</strong> {p.cantidad}</p>
                <p><strong>Estado:</strong> {p.estado}</p>
              </div>

              <button
                onClick={async () => {
                  const nuevoEstado =
                    p.estado === "pendiente"
                      ? "en proceso"
                      : p.estado === "en proceso"
                        ? "entregado"
                        : "pendiente";

                  await API.patch(`/pedidos/${p._id}/estado`, { estado: nuevoEstado });
                  onActualizar && onActualizar();
                }}
                className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
              >
                Cambiar Estado
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};


export default PedidoList;
