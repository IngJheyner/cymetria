"use client";

import { UserList } from "@/components/users/user-list";
import { UserDialog } from "@/components/users/user-dialog";
import { ExportButton } from "@/components/users/export-button";
import { useUserStore } from "@/lib/store/user-store";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function Home() {
  const { openCreateDialog } = useUserStore();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Gestión de Usuarios</h1>
          <p className="text-muted-foreground">
            Sistema de gestión de usuarios con arquitectura hexagonal
          </p>
        </div>

        {/* Acciones */}
        <div className="flex gap-4 mb-6">
          <Button onClick={openCreateDialog}>
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Usuario
          </Button>
          <ExportButton />
        </div>

        {/* Lista de usuarios */}
        <UserList />

        {/* Modal crear/editar */}
        <UserDialog />
      </div>
    </div>
  );
}
