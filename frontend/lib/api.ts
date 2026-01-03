import axios from "axios";

// URL del backend
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000, // 30 segundos
});

/**
 * Interceptor de respuestas
 */
apiClient.interceptors.response.use(
  // Respuesta exitosa: devuelve los datos directamente
  (response) => response,
  
  // Respuesta con error: extrae el mensaje
  (error) => {
    if (error.response?.data?.error) {
      // Error del backend con formato conocido
      return Promise.reject(error.response.data.error);
    }
    
    // Error de red u otro tipo
    return Promise.reject({
      message: error.message || "Error de conexión con el servidor",
    });
  }
);

