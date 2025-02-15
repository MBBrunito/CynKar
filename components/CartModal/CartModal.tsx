"use client";

import { useState } from "react";
import useCartStore from "../../app/carrito/store";
import { motion } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./CartModal.css";

type CartModalProps = {
   isOpen: boolean;
   onClose: () => void;
};
export default function CartModal({ isOpen, onClose }: CartModalProps) {
   const { cart, removeFromCart, updateQuantity, clearCart, resetearFiltros } =
      useCartStore();
   const [nombreCliente, setNombreCliente] = useState("");
   const [nota, setNota] = useState("");
   const [confirmarPedido, setConfirmarPedido] = useState(false);
   const [animacionConfirmado, setAnimacionConfirmado] = useState(false);

   if (!isOpen) return null;

   // Calcular el total del pedido
   const totalPedido = cart.reduce(
      (total, item) => total + item.precio * item.quantity,
      0
   );

   // Generar el mensaje para WhatsApp
   const generarMensajeWhatsApp = () => {
      if (cart.length === 0) return;
      if (!nombreCliente.trim()) {
         alert("Por favor, ingresa tu nombre antes de enviar el pedido.");
         return;
      }

      let mensaje = `📦 *Pedido de CynKar*%0A%0A`;
      cart.forEach((item) => {
         mensaje += `- ${item.nombre} (x${item.quantity}) - $${
            item.precio * item.quantity
         }%0A`;
      });

      mensaje += `%0A💰 *Total:* $${cart.reduce(
         (total, item) => total + item.precio * item.quantity,
         0
      )}`;
      mensaje += `%0A📍 *Retiro/envío:* [Opciones: Retiro en tienda / Envío a domicilio]`;
      mensaje += `%0A📞 *Nombre del Cliente:* ${nombreCliente}`;
      mensaje += nota.trim() ? `%0A📝 *Nota:* ${nota}` : "";

      const whatsappURL = `https://wa.me/5493883312242?text=${mensaje}`;
      window.open(whatsappURL, "_blank");

      // 🔹 Mostrar notificación
      toast.success("¡Pedido enviado con éxito!", {
         position: "top-center",
         autoClose: 3000, // Se cierra en 3 segundos
      });

      // 🔹 Vaciar carrito, cerrar modal y resetear filtros
      clearCart();
      onClose();
      resetearFiltros();
   };

   const handleVaciarCarrito = () => {
      clearCart();
      onClose(); // 🔹 Cierra el modal automáticamente
   };

   const handleConfirmarPedido = () => {
      setAnimacionConfirmado(true);
      setTimeout(() => {
         setConfirmarPedido(true);
         setAnimacionConfirmado(false);
      }, 1000); // 🔹 La animación dura 1 segundo antes de mostrar el botón de WhatsApp
   };

   return (
      <div className="cart-overlay" onClick={onClose}>
         <div className="cart-modal" onClick={(e) => e.stopPropagation()}>
            <ToastContainer /> {/* 🔹 Contenedor de notificaciones */}
            <button className="close-btn" onClick={onClose}>
               ×
            </button>
            <h2>Carrito de Compras</h2>
            {cart.length === 0 ? (
               <p>Tu carrito está vacío</p>
            ) : (
               <>
                  <ul className="cart-items">
                     {cart.map((item) => (
                        <li key={item.id} className="cart-item">
                           <img
                              src={item.imagen}
                              alt={item.nombre}
                              className="cart-item-img"
                           />
                           <div className="cart-item-info">
                              <h4>{item.nombre}</h4>
                              <p>
                                 ${item.precio.toFixed(2)} x {item.quantity}
                              </p>
                           </div>
                           <input
                              type="number"
                              value={item.quantity}
                              min="1"
                              onChange={(e) =>
                                 updateQuantity(item.id, Number(e.target.value))
                              }
                              className="quantity-input"
                           />
                           <button
                              className="remove-item-btn"
                              onClick={() => removeFromCart(item.id)}
                           >
                              🗑️
                           </button>
                        </li>
                     ))}
                  </ul>

                  <div className="cart-footer">
                     <p className="cart-total">
                        <strong>Total:</strong> ${totalPedido.toFixed(2)}
                     </p>

                     <div className="input-group">
                        <label>Nombre:</label>
                        <input
                           type="text"
                           value={nombreCliente}
                           onChange={(e) => setNombreCliente(e.target.value)}
                           placeholder="Ingresa tu nombre"
                        />
                     </div>

                     <div className="input-group">
                        <label>Nota opcional:</label>
                        <textarea
                           value={nota}
                           onChange={(e) => setNota(e.target.value)}
                           placeholder="Detalles adicionales para tu pedido..."
                        />
                     </div>

                     <motion.button
                        className="whatsapp-btn"
                        onClick={generarMensajeWhatsApp}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                     >
                        Enviar a WhatsApp
                     </motion.button>

                     <button className="vaciar-btn" onClick={clearCart}>
                        Vaciar Carrito
                     </button>
                  </div>
               </>
            )}
         </div>
      </div>
   );
}
