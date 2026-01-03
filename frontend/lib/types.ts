// Usuario del dominio
export interface User {
  id?: string;
  name: string;
  email: string;
  createdAt?: string;
  updatedAt?: string;
}

// Parámetros de paginación
export interface PaginationParams {
  page: number;
  pageSize: number;
}

// Resultado paginado
export interface PaginatedResult<T> {
  data: T[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

// Respuesta de error del backend
export interface ApiError {
  success: false;
  error: {
    message: string;
    errors?: Array<{
      field: string;
      message: string;
    }>;
  };
}

// Estados del formulario
export type FormMode = "create" | "edit";

