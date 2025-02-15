"use client";

import { useState } from "react";
import Image from "next/image";
import useCartStore from "../../app/carrito/store";
import "./ProductCard.css";

type Product = {
   id: string;
   nombre: string;
   precio: number;
   imagen: string;
};

export default function ProductCard({ producto }: { producto: Product }) {
   const { addToCart } = useCartStore();
   const [cantidad, setCantidad] = useState(1);

   return (
      <div className="product-card">
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

            <div className="quantity-selector">
               <label>Cantidad:</label>
               <input
                  type="number"
                  value={cantidad}
                  min="1"
                  onChange={(e) => setCantidad(Number(e.target.value))}
               />
            </div>

            <button
               className="add-to-cart-btn"
               onClick={() => addToCart({ ...producto, quantity: cantidad })}
            >
               Agregar al carrito
            </button>
         </div>
      </div>
   );
}
