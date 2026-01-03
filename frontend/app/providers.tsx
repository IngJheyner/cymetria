/**
 * Providers - Configuración de React Query
 */

"use client"; // Importante: este es un Client Component (no Server Component)

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

/**
 * Configuración de React Query
 */
function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: 1,
        refetchOnWindowFocus: false,
      },
      mutations: {
        retry: 0,
      },
    },
  });
}

/**
 * Componente Providers
 */
export function Providers({ children }: { children: React.ReactNode }) {
  // Crear QueryClient solo una vez (por usuario/sesión)
  const [queryClient] = useState(() => makeQueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}

