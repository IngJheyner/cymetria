"use client";

import { useExportUsers } from "@/lib/queries/user-queries";
import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";
import { toast } from "sonner";

export function ExportButton() {
  const exportUsers = useExportUsers();

  const handleExport = async () => {
    try {
      await exportUsers.mutateAsync();
      toast.success("Archivo descargado exitosamente");
    } catch (error: any) {
      toast.error(error.message || "Error al exportar usuarios");
    }
  };

  return (
    <Button
      variant="outline"
      onClick={handleExport}
      disabled={exportUsers.isPending}
    >
      {exportUsers.isPending ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <Download className="mr-2 h-4 w-4" />
      )}
      Exportar CSV
    </Button>
  );
}

