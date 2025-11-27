import React, { useState } from "react";
import API from "../service/api";

const PedidoForm = ({ onNuevoPedido }) => {
    const [form, setForm] = useState({
        cliente: "",
        producto: "",
        cantidad: 1,
    });

    const [errors, setErrors] = useState({});

    const validar = () => {
        const newErrors = {};

        if (!form.cliente.trim()) newErrors.cliente = "El nombre del cliente es obligatorio";
        if (!form.producto.trim()) newErrors.producto = "Debe seleccionar un producto";
        if (form.cantidad < 1) newErrors.cantidad = "Cantidad mínima es 1";

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validar()) return;

        try {
            await API.post("/pedidos", form);
            onNuevoPedido();
            setForm({ cliente: "", producto: "", cantidad: 1 });
            setErrors({});
        } catch (error) {
            console.error("Error al crear pedido:", error);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="p-4 bg-white shadow-md rounded-lg mb-8 max-w-xl mx-auto"
        >
            <h2 className="text-2xl font-bold mb-4">Crear Pedido</h2>

            {/* Cliente */}
            <label className="block font-medium">Cliente</label>
            <input
                type="text"
                className={`w-full p-2 border rounded mb-2 ${errors.cliente ? "border-red-500" : "border-gray-300"
                    }`}
                value={form.cliente}
                onChange={(e) => setForm({ ...form, cliente: e.target.value })}
            />
            {errors.cliente && <p className="text-red-500 text-sm">{errors.cliente}</p>}

            {/* Producto */}
            <label className="block font-medium mt-3">Producto</label>
            <input
                type="text"
                className={`w-full p-2 border rounded mb-2 ${errors.producto ? "border-red-500" : "border-gray-300"
                    }`}
                value={form.producto}
                onChange={(e) => setForm({ ...form, producto: e.target.value })}
            />
            {errors.producto && <p className="text-red-500 text-sm">{errors.producto}</p>}

            {/* Cantidad */}
            <label className="block font-medium mt-3">Cantidad</label>
            <input
                type="number"
                className={`w-full p-2 border rounded ${errors.cantidad ? "border-red-500" : "border-gray-300"
                    }`}
                value={form.cantidad}
                onChange={(e) => setForm({ ...form, cantidad: Number(e.target.value) })}
            />
            {errors.cantidad && <p className="text-red-500 text-sm">{errors.cantidad}</p>}

            <button
                type="submit"
                className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
                Crear Pedido
            </button>
        </form>
    );
};

export default PedidoForm;
