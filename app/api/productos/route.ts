import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
   try {
      const productos = await prisma.producto.findMany();

      if (!productos || productos.length === 0) {
         return NextResponse.json({ productos: [] }, { status: 200 });
      }

      return NextResponse.json(productos);
   } catch (error) {
      console.error("Error en /api/productos:", error);
      return NextResponse.json(
         { error: "Error al obtener productos" },
         { status: 500 }
      );
   }
}
