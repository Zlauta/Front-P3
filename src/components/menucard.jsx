// src/components/MenuCard.jsx
import React from "react";
import { motion } from "framer-motion";

const MenuCard = ({ plato }) => {
    return (
        <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-white shadow-md rounded-2xl overflow-hidden cursor-pointer transition"
        >
            <img
                src={plato.imagen}
                alt={plato.nombre}
                className="w-full h-48 object-cover"
            />
            <div className="p-4">
                <h3 className="text-xl font-semibold">{plato.nombre}</h3>
                <p className="text-gray-600">${plato.precio}</p>
            </div>
        </motion.div>
    );
};

export default MenuCard;
