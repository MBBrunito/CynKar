"use client";

import { useState } from "react";
import CartModal from "../../components/CartModal/CartModal";
import useCartStore from "../../app/carrito/store";

export default function Navbar() {
   const [cartOpen, setCartOpen] = useState(false);
   const { cart } = useCartStore();

   return (
      <nav className="navbar">
         <h1>CynKar</h1>
         <button onClick={() => setCartOpen(true)}>
            🛒 Carrito ({cart.length})
         </button>
         <CartModal isOpen={cartOpen} onClose={() => setCartOpen(false)} />
      </nav>
   );
}
