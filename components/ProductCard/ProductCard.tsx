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
      <div className="card">
         <Image
            src={producto.imagen}
            alt={producto.nombre}
            width={200}
            height={200}
         />
         <h3>{producto.nombre}</h3>
         <p>${producto.precio}</p>
         <input
            type="number"
            value={cantidad}
            min="1"
            onChange={(e) => setCantidad(Number(e.target.value))}
         />
         <button onClick={() => addToCart({ ...producto, quantity: cantidad })}>
            Agregar al carrito
         </button>
      </div>
   );
}
