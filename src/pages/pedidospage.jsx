// src/pages/PedidosPage.jsx
import React, { useState, useEffect } from "react";
import PedidoForm from "../components/PedidoForm";
import PedidoList from "../components/PedidoList";
import MenuCard from "../components/MenuCard";
import API from "../service/api";

const PedidosPage = () => {
    const [pedidos, setPedidos] = useState([]);
    const [menu, setMenu] = useState([
        { id: 1, nombre: "Pizza Margarita", precio: 2500, imagen: "/pizza.jpg" },
        { id: 2, nombre: "Hamburguesa Doble", precio: 3000, imagen: "/burger.jpg" },
        { id: 3, nombre: "Ensalada César", precio: 2000, imagen: "/salad.jpg" },
    ]);

    // Traer pedidos del backend
    const obtenerPedidos = async () => {
        try {
            const res = await API.get("/pedidos");
            setPedidos(res.data);
        } catch (error) {
            console.error("Error al obtener pedidos:", error);
        }
    };

    useEffect(() => {
        obtenerPedidos();
    }, []);

    // Función para actualizar la lista sin recargar la página
    const handlePedidoActualizado = () => {
        obtenerPedidos(); // vuelve a consultar al backend
    };

    return (
        <div className="p-6 bg-[#f8f9fa] min-h-screen">
            <h1 className="text-4xl font-bold mb-6 text-center text-[#333]">
                🧾 Sistema de Pedidos del Restaurante
            </h1>

            {/* MENÚ DE PLATOS */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
                {menu.map((plato) => (
                    <MenuCard key={plato.id} plato={plato} />
                ))}
            </section>

            {/* FORMULARIO PARA CREAR PEDIDO */}
            <PedidoForm onNuevoPedido={handlePedidoActualizado} />

            {/* LISTA DE PEDIDOS */}
            <PedidoList pedidos={pedidos} onActualizar={handlePedidoActualizado} />
        </div>
    );
};

export default PedidosPage;
