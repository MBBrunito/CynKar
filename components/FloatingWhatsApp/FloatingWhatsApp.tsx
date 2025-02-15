"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import "./FloatingWhatsApp.css";

export default function FloatingWhatsApp() {
   const mensaje = encodeURIComponent(
      "Hola! Me gustaría recibir información sobre sus productos y servicios. ¿Podrían ayudarme?"
   );

   const whatsappURL = `https://wa.me/5493883312242?text=${mensaje}`;

   return (
      <motion.div
         className="whatsapp-float"
         initial={{ opacity: 0, scale: 0.5 }}
         animate={{ opacity: 1, scale: 1 }}
         transition={{ duration: 0.5 }}
         whileHover={{ scale: 1.1 }}
      >
         <Link href={whatsappURL} target="_blank">
            <img
               src="/whatsapp-icon.png"
               alt="WhatsApp"
               className="whatsapp-icon"
            />
         </Link>
      </motion.div>
   );
}
