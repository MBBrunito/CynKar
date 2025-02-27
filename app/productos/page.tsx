"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import ProductCard from "../../components/ProductCard/ProductCard";
import CartModal from "../../components/CartModal/CartModal";
import useCartStore from "../../app/carrito/store";
import "./productos.css";

type Product = {
   id: string;
   nombre: string;
   precio: number;
   imagen: string;
   categoria: string;
   stock: number;
};

function ProductosContent() {
   const [productos, setProductos] = useState<Product[]>([]);
   const [categorias, setCategorias] = useState<string[]>([]);

   const searchParams = useSearchParams();
   const router = useRouter();
   const { cart } = useCartStore();

   // Estados sincronizados con la URL
   const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(
      searchParams.get("categoria") || ""
   );
   const [busqueda, setBusqueda] = useState(searchParams.get("busqueda") || "");
   const [rangoPrecio, setRangoPrecio] = useState(
      searchParams.get("precio") || ""
   );
   const [cartOpen, setCartOpen] = useState(false);

   useEffect(() => {
      fetch("/api/productos")
         .then((res) => res.json())
         .then((data: Product[]) => setProductos(data))
         .catch((error) => console.error("Error al cargar productos:", error));

      fetch("/api/categorias")
         .then((res) => res.json())
         .then((data: string[]) => setCategorias(data))
         .catch((error) => console.error("Error al cargar categorías:", error));
   }, []);

   // Función para actualizar la URL sin recargar la página
   const actualizarURL = (param: string, valor: string) => {
      const newParams = new URLSearchParams(window.location.search);
      if (valor) {
         newParams.set(param, valor);
      } else {
         newParams.delete(param);
      }
      router.push(`/productos?${newParams.toString()}`);
   };

   // Manejar cambios en los filtros
   const handleCategoriaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      setCategoriaSeleccionada(e.target.value);
      actualizarURL("categoria", e.target.value);
   };

   const handleBusquedaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setBusqueda(e.target.value);
      actualizarURL("busqueda", e.target.value);
   };

   const handleRangoPrecioChange = (
      e: React.ChangeEvent<HTMLSelectElement>
   ) => {
      setRangoPrecio(e.target.value);
      actualizarURL("precio", e.target.value);
   };

   // Filtrar productos
   const productosFiltrados = productos.filter((producto) => {
      const coincideCategoria = categoriaSeleccionada
         ? producto.categoria === categoriaSeleccionada
         : true;
      const coincideBusqueda = busqueda
         ? producto.nombre.toLowerCase().includes(busqueda.toLowerCase())
         : true;
      const coincidePrecio =
         rangoPrecio === "low"
            ? producto.precio < 500
            : rangoPrecio === "medium"
            ? producto.precio >= 500 && producto.precio <= 1000
            : rangoPrecio === "high"
            ? producto.precio > 1000
            : true;

      return coincideCategoria && coincideBusqueda && coincidePrecio;
   });

   const resetearFiltros = () => {
      setCategoriaSeleccionada("");
      setBusqueda("");
      setRangoPrecio("");
      router.push("/productos"); // 🔹 Restablece la URL sin filtros
   };

   return (
      <div>
         <h1>Catálogo de Productos</h1>

         {/* Filtros */}
         <div className="filters-container">
            <div className="filter-group">
               <label>Categoría:</label>
               <select
                  value={categoriaSeleccionada}
                  onChange={handleCategoriaChange}
               >
                  <option value="">Todas</option>
                  {categorias.map((categoria) => (
                     <option key={categoria} value={categoria}>
                        {categoria}
                     </option>
                  ))}
               </select>
            </div>

            <div className="filter-group">
               <label>Buscar:</label>
               <input
                  type="text"
                  placeholder="Ej: Fotocopias..."
                  value={busqueda}
                  onChange={handleBusquedaChange}
               />
            </div>

            <div className="filter-group">
               <label>Precio:</label>
               <select value={rangoPrecio} onChange={handleRangoPrecioChange}>
                  <option value="">Todos</option>
                  <option value="low">Menos de $500</option>
                  <option value="medium">$500 - $1000</option>
                  <option value="high">Más de $1000</option>
               </select>
            </div>

            <button className="reset-filters" onClick={resetearFiltros}>
               Limpiar Filtros
            </button>
         </div>

         {/* Botón para abrir el carrito */}
         <button onClick={() => setCartOpen(true)}>
            🛒 Ver Carrito ({cart.length})
         </button>

         {/* Modal del carrito */}
         <CartModal isOpen={cartOpen} onClose={() => setCartOpen(false)} />

         {/* Mostrar productos filtrados */}
         <div className="productos-grid">
            {productosFiltrados.length > 0 ? (
               productosFiltrados.map((producto) => (
                  <ProductCard key={producto.id} producto={producto} />
               ))
            ) : (
               <p>No hay productos disponibles.</p>
            )}
         </div>
      </div>
   );
}

// 🔹 Envolver `ProductosContent` en `<Suspense>` para evitar errores en el build de Vercel
export default function ProductosPage() {
   return (
      <Suspense fallback={<p>Cargando productos...</p>}>
         <ProductosContent />
      </Suspense>
   );
}
