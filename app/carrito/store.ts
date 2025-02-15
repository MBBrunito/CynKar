import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type Product = {
   id: string;
   nombre: string;
   precio: number;
   imagen: string;
   quantity: number;
};

type CartState = {
   cart: Product[];
   addToCart: (product: Product) => void;
   removeFromCart: (id: string) => void;
   updateQuantity: (id: string, quantity: number) => void;
   clearCart: () => void;
   resetearFiltros: () => void;
};

const useCartStore = create<CartState>()(
   persist(
      (set) => ({
         cart: [],

         addToCart: (product) =>
            set((state) => {
               const exists = state.cart.find((item) => item.id === product.id);
               if (exists) {
                  return {
                     cart: state.cart.map((item) =>
                        item.id === product.id
                           ? {
                                ...item,
                                quantity: item.quantity + product.quantity,
                             }
                           : item
                     ),
                  };
               }
               return { cart: [...state.cart, product] };
            }),

         removeFromCart: (id) =>
            set((state) => ({
               cart: state.cart.filter((item) => item.id !== id),
            })),

         updateQuantity: (id, quantity) =>
            set((state) => ({
               cart: state.cart.map((item) =>
                  item.id === id ? { ...item, quantity } : item
               ),
            })),

         clearCart: () => set({ cart: [] }),

         // 🔹 Nueva función para resetear filtros
         resetearFiltros: () => {
            if (typeof window !== "undefined") {
               const newURL =
                  window.location.protocol +
                  "//" +
                  window.location.host +
                  "/productos";
               window.history.pushState({ path: newURL }, "", newURL);
            }
         },
      }),
      {
         name: "cart-storage",
         storage: createJSONStorage(() => localStorage),
      }
   )
);

export default useCartStore;
