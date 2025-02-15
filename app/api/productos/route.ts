import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Obtener todos los productos
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

// NUEVO ENDPOINT PARA CATEGORÍAS
export async function GET_CATEGORIAS() {
   try {
      const categorias = await prisma.producto.findMany({
         select: { categoria: true },
      });

      // Extraer solo los valores únicos
      const categoriasUnicas = [...new Set(categorias.map((c) => c.categoria))];

      return NextResponse.json(categoriasUnicas);
   } catch (error) {
      console.error("Error en /api/categorias:", error);
      return NextResponse.json(
         { error: "Error al obtener categorías" },
         { status: 500 }
      );
   }
}
