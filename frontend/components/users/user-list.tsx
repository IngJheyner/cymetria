"use client";

import { useState } from "react";
import { useUsers, useDeleteUser } from "@/lib/queries/user-queries";
import { useUserStore } from "@/lib/store/user-store";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

export function UserList() {
  const [page, setPage] = useState(1);
  const pageSize = 10;

  // React Query hook - maneja automáticamente loading, error, data
  const { data, isLoading, error } = useUsers({ page, pageSize });

  // Zustand store - para abrir el modal de edición
  const { openEditDialog } = useUserStore();

  // Mutation para eliminar usuario
  const deleteUser = useDeleteUser();

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`¿Estás seguro de eliminar a ${name}?`)) return;

    try {
      await deleteUser.mutateAsync(id);
      toast.success("Usuario eliminado exitosamente");
    } catch (error: any) {
      toast.error(error.message || "Error al eliminar usuario");
    }
  };

  // Estado de carga
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Estado de error
  if (error) {
    return (
      <Card>
        <CardContent className="py-12">
          <p className="text-center text-destructive">
            Error: {error.message || "No se pudo cargar los usuarios"}
          </p>
        </CardContent>
      </Card>
    );
  }

  // Estado vacío
  if (!data || data.data.length === 0) {
    return (
      <Card>
        <CardContent className="py-12">
          <p className="text-center text-muted-foreground">
            No hay usuarios registrados
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>
            Lista de Usuarios ({data.total} total{data.total !== 1 ? "es" : ""})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Fecha de Creación</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.data.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    {user.createdAt
                      ? new Date(user.createdAt).toLocaleDateString("es-ES")
                      : "-"}
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openEditDialog(user)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(user.id!, user.name)}
                      disabled={deleteUser.isPending}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Paginación */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Página {data.page} de {data.totalPages} ({data.total} usuarios)
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Anterior
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.min(data.totalPages, p + 1))}
            disabled={page === data.totalPages}
          >
            Siguiente
          </Button>
        </div>
      </div>
    </div>
  );
}

