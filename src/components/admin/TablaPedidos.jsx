import { useEffect, useState } from "react";
import { Table, Button, Form } from "react-bootstrap";
import Swal from "sweetalert2";
import "../../index.css";

import {
    obtenerPedidos,
    actualizarEstadoPedido,
    eliminarPedido,
} from "../../service/pedidos.service.js";

function formatearFecha(iso) {
    try {
        return new Date(iso).toLocaleString();
    } catch {
        return iso ?? "";
    }
}
const TablaPedidos = () => {
    const [pedidos, setPedidos] = useState([]);
    const [ediciones, setEdiciones] = useState({});

    const cargar = async () => {
        try {
            const data = await obtenerPedidos();
            setPedidos(data);
        } catch (error) {
            console.error("Error al cargar pedidos:", error);
        }
    };

    useEffect(() => {
        cargar();
    }, []);

    const manejarEstado = (id, valor) => {
        setEdiciones((prev) => ({
            ...prev,
            [id]: {
                ...prev[id],
                estado: valor,
            },
        }));
    };

    const guardarCambios = async (id) => {
        const cambios = ediciones[id];
        if (!cambios) return;

        try {
            await actualizarEstadoPedido(id, cambios.estado);
            await cargar();

            setEdiciones((prev) => {
                const copia = { ...prev };
                delete copia[id];
                return copia;
            });

            Swal.fire({
                title: "Pedido actualizado",
                icon: "success",
                timer: 1200,
                showConfirmButton: false,
            });
        } catch (error) {
            console.error("Error al actualizar pedido:", error);
            Swal.fire({
                title: "Error al actualizar pedido",
                icon: "error",
            });
        }
    };

    const manejarEliminar = async (id) => {
        const result = await Swal.fire({
            title: "¿Eliminar este pedido?",
            text: "Esta acción no se puede deshacer",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#1aaf4b",
            cancelButtonColor: "#042d12",
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar",
        });

        if (!result.isConfirmed) return;

        try {
            await eliminarPedido(id);
            await cargar();

            Swal.fire({
                title: "Pedido eliminado",
                icon: "success",
                timer: 1200,
                showConfirmButton: false,
            });
        } catch (error) {
            console.error("Error al eliminar pedido:", error);
            Swal.fire({
                title: "Error al eliminar pedido",
                icon: "error",
            });
        }
    };

    return (
        <div className="p-1">
            <h3 className="text-light fs-1 mt-5 mb-5">Gestión de Pedidos</h3>

            <Table striped bordered hover responsive>
                <thead>
                    <tr>
                        <th className="tabla">#</th>
                        <th className="tabla">Cliente</th>
                        <th className="tabla">Items</th>
                        <th className="tabla">Total</th>
                        <th className="tabla">Dirección</th>
                        <th className="tabla">Teléfono</th>
                        <th className="tabla">Estado</th>
                        <th className="tabla">Fecha</th>
                        <th className="tabla">Acción</th>
                    </tr>
                </thead>

                <tbody style={{ background: "#1E2A26" }}>
                    {pedidos.length ? (
                        pedidos.map((pedido, idx) => (
                            <tr key={pedido._id}>
                                <td className="tabla">{idx + 1}</td>

                                {/* CLIENTE */}
                                <td className="tabla">
                                    {pedido.cliente?.nombre ?? "Sin cliente"}
                                </td>

                                {/* ITEMS */}
                                <td className="tabla">
                                    {pedido.items?.map((item, i) => (
                                        <div key={i}>
                                            {item.producto?.nombre} × {item.cantidad}
                                        </div>
                                    ))}
                                </td>

                                {/* TOTAL */}
                                <td className="tabla">${pedido.total}</td>

                                {/* DIRECCIÓN */}
                                <td className="tabla">{pedido.direccion}</td>

                                {/* TELÉFONO */}
                                <td className="tabla">{pedido.telefono}</td>

                                {/* ESTADO */}
                                <td className="tabla">
                                    <Form.Select
                                        value={ediciones[pedido._id]?.estado ?? pedido.estado}
                                        onChange={(e) =>
                                            manejarEstado(pedido._id, e.target.value)
                                        }
                                    >
                                        <option value="pendiente">pendiente</option>
                                        <option value="confirmado">confirmado</option>
                                        <option value="preparando">preparando</option>
                                        <option value="listo">listo</option>
                                        <option value="entregado">entregado</option>
                                        <option value="cancelado">cancelado</option>
                                    </Form.Select>
                                </td>

                                {/* FECHA */}
                                <td className="tabla">{formatearFecha(pedido.createdAt)}</td>

                                {/* ACCIONES */}
                                <td className="tabla d-flex flex-column gap-2">
                                    <Button
                                        className="btn-tabla"
                                        size="sm"
                                        variant="secondary"
                                        onClick={() => guardarCambios(pedido._id)}
                                        disabled={!ediciones[pedido._id]}
                                    >
                                        Guardar
                                    </Button>

                                    <Button
                                        className="btn-tabla btn-eliminar"
                                        size="sm"
                                        variant="success"
                                        onClick={() => manejarEliminar(pedido._id)}
                                    >
                                        Eliminar
                                    </Button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={9} className="text-center py-4">
                                No hay pedidos registrados.
                            </td>
                        </tr>
                    )}
                </tbody>
            </Table>

            <div className="text-light fs-5">
                Total: {pedidos.length} pedido{pedidos.length === 1 ? "" : "s"}
            </div>
        </div>
    );
}
export default TablaPedidos