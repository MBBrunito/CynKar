import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
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
