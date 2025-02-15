import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// 🔹 Obtener todos los productos
export async function GET() {
   try {
      const productos = await prisma.producto.findMany();
      return NextResponse.json(productos);
   } catch (error) {
      console.error("Error en /api/productos:", error);
      return NextResponse.json(
         { error: "Error al obtener productos" },
         { status: 500 }
      );
   }
}
