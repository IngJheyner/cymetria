"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useUserStore } from "@/lib/store/user-store";
import { useCreateUser, useUpdateUser } from "@/lib/queries/user-queries";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

// Esquema de validación con Zod
const userSchema = z.object({
  name: z
    .string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(100, "El nombre no puede exceder 100 caracteres"),
  email: z
    .string()
    .email("Email inválido")
    .toLowerCase(),
});

type UserFormData = z.infer<typeof userSchema>;

export function UserDialog() {
  // Estado global del modal
  const { isDialogOpen, selectedUser, formMode, closeDialog } = useUserStore();

  // Mutations
  const createUser = useCreateUser();
  const updateUser = useUpdateUser();

  // Formulario con validación
  const form = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: "",
      email: "",
    },
  });

  // Cargar datos del usuario al editar
  useEffect(() => {
    if (selectedUser) {
      form.reset({
        name: selectedUser.name,
        email: selectedUser.email,
      });
    } else {
      form.reset({
        name: "",
        email: "",
      });
    }
  }, [selectedUser, form]);

  const onSubmit = async (data: UserFormData) => {
    try {
      if (formMode === "create") {
        await createUser.mutateAsync(data);
        toast.success("Usuario creado exitosamente");
      } else {
        await updateUser.mutateAsync({
          id: selectedUser!.id!,
          data,
        });
        toast.success("Usuario actualizado exitosamente");
      }
      closeDialog();
      form.reset();
    } catch (error: any) {
      toast.error(error.message || "Error al guardar usuario");
    }
  };

  const isPending = createUser.isPending || updateUser.isPending;

  return (
    <Dialog open={isDialogOpen} onOpenChange={closeDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {formMode === "create" ? "Crear Usuario" : "Editar Usuario"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Juan Pérez"
                      {...field}
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="juan@ejemplo.com"
                      {...field}
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={closeDialog}
                disabled={isPending}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {formMode === "create" ? "Crear" : "Guardar"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

