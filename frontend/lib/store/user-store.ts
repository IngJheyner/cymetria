/**
 * Zustand Store - Estado Global
 */

import { create } from "zustand";
import { User, FormMode } from "../types";

/**
 * Interfaz del store
 */
interface UserStore {
  // Estado
  isDialogOpen: boolean;
  selectedUser: User | null;
  formMode: FormMode;

  // Acciones
  openCreateDialog: () => void;
  openEditDialog: (user: User) => void;
  closeDialog: () => void;
}

/**
 * Hook de Zustand
 */
export const useUserStore = create<UserStore>((set) => ({
  // Estado inicial
  isDialogOpen: false,
  selectedUser: null,
  formMode: "create",

  // Abrir modal para crear usuario
  openCreateDialog: () =>
    set({
      isDialogOpen: true,
      selectedUser: null,
      formMode: "create",
    }),

  // Abrir modal para editar usuario
  openEditDialog: (user: User) =>
    set({
      isDialogOpen: true,
      selectedUser: user,
      formMode: "edit",
    }),

  // Cerrar modal y limpiar estado
  closeDialog: () =>
    set({
      isDialogOpen: false,
      selectedUser: null,
      formMode: "create",
    }),
}));

