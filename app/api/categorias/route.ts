import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
   try {
      const categorias = await prisma.producto.findMany({
         select: { categoria: true },
      });

      // Si la consulta no devuelve nada, aseguramos que devuelva un array vacío
      if (!categorias || categorias.length === 0) {
         return NextResponse.json({ categorias: [] }, { status: 200 });
      }

      // Extraer solo valores únicos
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
