"use client";

import { useState } from "react";
import Image from "next/image";
import useCartStore from "../../app/carrito/store";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./ProductCard.css";

type Product = {
   id: string;
   nombre: string;
   precio: number;
   imagen: string;
   stock: number;
};

type CartProduct = Product & { quantity: number };

export default function ProductCard({ producto }: { producto: Product }) {
   const { addToCart, cart } = useCartStore() as {
      addToCart: (product: CartProduct) => void;
      cart: CartProduct[];
   };

   const [cantidad, setCantidad] = useState(1);

   const handleAddToCart = () => {
      const itemInCart = cart.find((item) => item.id === producto.id);
      const totalEnCarrito = itemInCart
         ? itemInCart.quantity + cantidad
         : cantidad;

      if (totalEnCarrito > producto.stock) {
         toast.error(
            "No puedes agregar más productos de los disponibles en stock."
         );
         return;
      }

      addToCart({ ...producto, quantity: cantidad });

      // 🔹 Mostrar notificación de confirmación
      toast.success(`Se añadieron ${cantidad} producto(s) al carrito.`);

      // 🔹 Reiniciar cantidad a 1
      setCantidad(1);
   };

   return (
      <div className="product-card">
         <ToastContainer />
         <div className="image-container">
            <Image
               src={producto.imagen}
               alt={producto.nombre}
               width={200}
               height={200}
            />
         </div>

         <div className="product-info">
            <h3>{producto.nombre}</h3>
            <p className="price">${producto.precio.toFixed(2)}</p>

            <p className={producto.stock > 0 ? "stock-available" : "stock-out"}>
               {producto.stock > 0 ? `Stock: ${producto.stock}` : "Agotado"}
            </p>

            <div className="quantity-selector">
               <label>Cantidad:</label>
               <input
                  type="number"
                  value={cantidad}
                  min="1"
                  max={producto.stock}
                  onChange={(e) => setCantidad(Number(e.target.value))}
                  disabled={producto.stock === 0}
               />
            </div>

            <button
               className="add-to-cart-btn"
               onClick={handleAddToCart}
               disabled={producto.stock === 0}
            >
               {producto.stock > 0 ? "Agregar al carrito" : "Sin Stock"}
            </button>
         </div>
      </div>
   );
}
