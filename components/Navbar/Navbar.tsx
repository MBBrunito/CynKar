"use client";

import { useState } from "react";
import CartModal from "../../components/CartModal/CartModal";
import useCartStore from "../../app/carrito/store";
import "./Navbar.css";

export default function Navbar() {
   const [cartOpen, setCartOpen] = useState(false);
   const { cart } = useCartStore();

   return (
      <nav className="navbar">
         <div className="nav-container">
            <h1 className="logo">CynKar</h1>
            <button className="cart-btn" onClick={() => setCartOpen(true)}>
               🛒 Carrito ({cart.length})
            </button>
         </div>
         <CartModal isOpen={cartOpen} onClose={() => setCartOpen(false)} />
      </nav>
   );
}
