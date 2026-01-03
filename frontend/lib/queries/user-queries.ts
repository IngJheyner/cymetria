/**
 * React Query - Hooks para Datos del Servidor
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../api";
import { User, PaginatedResult, PaginationParams } from "../types";

/**
 * Query Keys - Identificadores únicos para cachés
 */
export const userKeys = {
  all: ["users"] as const,
  lists: () => [...userKeys.all, "list"] as const,
  list: (params: PaginationParams) => [...userKeys.lists(), params] as const,
  detail: (id: string) => [...userKeys.all, "detail", id] as const,
};

/**
 * useUsers - Obtener lista paginada de usuarios
 */
export function useUsers(params: PaginationParams) {
  return useQuery({
    queryKey: userKeys.list(params),
    queryFn: async () => {
      const { data } = await apiClient.get<PaginatedResult<User>>(
        "/api/v1/users",
        { params }
      );
      return data;
    },
    // Mantener datos en caché por 5 minutos
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * useUser - Obtener un usuario por ID
 */
export function useUser(id: string) {
  return useQuery({
    queryKey: userKeys.detail(id),
    queryFn: async () => {
      const { data } = await apiClient.get<User>(`/api/v1/users/${id}`);
      return data;
    },
    enabled: !!id, // Solo ejecuta si hay ID
  });
}

/**
 * useCreateUser - Crear un nuevo usuario
 */
export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (user: Omit<User, "id">) => {
      const { data } = await apiClient.post<User>("/api/v1/users", user);
      return data;
    },
    // Cuando la mutación es exitosa, invalida el caché
    // Esto fuerza un refetch automático de la lista
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
  });
}

/**
 * useUpdateUser - Actualizar un usuario existente
 */
export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: Partial<User>;
    }) => {
      const response = await apiClient.put<User>(`/api/v1/users/${id}`, data);
      return response.data;
    },
    // Invalida tanto la lista como el detalle del usuario
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      queryClient.invalidateQueries({ queryKey: userKeys.detail(variables.id) });
    },
  });
}

/**
 * useDeleteUser - Eliminar un usuario
 */
export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/api/v1/users/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
  });
}

/**
 * useExportUsers - Descargar usuarios en CSV
 * ```
 */
export function useExportUsers() {
  return useMutation({
    mutationFn: async () => {
      const response = await apiClient.get("/api/v1/users/export", {
        responseType: "blob", // Importante: indicar que esperamos un archivo
      });

      // Crear un link temporal para descargar el archivo
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `users-${new Date().toISOString()}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    },
  });
}

