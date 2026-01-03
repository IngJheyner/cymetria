# Frontend - Cymetria

Sistema de gestión de usuarios desarrollado con **Next.js 15**, **React Query**, **Zustand**, **shadcn/ui** y **Tailwind CSS**.

## 🚀 Tecnologías Principales

### Framework y UI
- **Next.js 15** con App Router (Server/Client Components)
- **React 19** con React Server Components
- **TypeScript** para type-safety
- **Tailwind CSS** para estilos
- **shadcn/ui** para componentes UI reutilizables

### Gestión de Estado y Datos
- **React Query (@tanstack/react-query)**: Manejo de datos del servidor
  - Caché automático
  - Refetch y revalidación
  - Estados de loading/error
  - Optimistic updates
  
- **Zustand**: Estado global ligero
  - Gestión de UI (modales, selección)
  - Sin boilerplate (más simple que Redux)

### Validación y Forms
- **React Hook Form**: Formularios con performance
- **Zod**: Validación de esquemas TypeScript
- **@hookform/resolvers**: Integración Zod + React Hook Form

### Otros
- **Axios**: Cliente HTTP
- **Lucide React**: Íconos modernos
- **Sonner**: Notificaciones toast

---

## 📁 Estructura del Proyecto

```
frontend/
├── app/                      # App Router de Next.js
│   ├── layout.tsx           # Layout principal (con Providers)
│   ├── page.tsx             # Página principal (Home)
│   ├── providers.tsx        # QueryClientProvider (React Query)
│   └── globals.css          # Estilos globales
│
├── components/
│   ├── ui/                  # Componentes de shadcn/ui
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── table.tsx
│   │   ├── dialog.tsx
│   │   ├── form.tsx
│   │   ├── input.tsx
│   │   └── ...
│   └── users/               # Componentes específicos de usuarios
│       ├── user-list.tsx    # Listado paginado de usuarios
│       ├── user-dialog.tsx  # Modal crear/editar usuario
│       └── export-button.tsx # Botón exportar CSV
│
├── lib/
│   ├── api.ts               # Cliente Axios configurado
│   ├── types.ts             # Tipos TypeScript compartidos
│   ├── utils.ts             # Utilidades (cn, etc.)
│   ├── queries/
│   │   └── user-queries.ts  # Hooks de React Query (useUsers, etc.)
│   └── store/
│       └── user-store.ts    # Store de Zustand (modal state)
│
├── public/                   # Archivos estáticos
├── .env.local               # Variables de entorno (no en Git)
├── next.config.ts           # Configuración de Next.js
├── tailwind.config.ts       # Configuración de Tailwind
├── tsconfig.json            # Configuración de TypeScript
└── package.json             # Dependencias
```

---

## 🔧 Configuración Inicial

### 1. Variables de Entorno

Crear archivo `.env.local` en la raíz del frontend:

```bash
# URL del backend
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### 2. Instalar Dependencias

```bash
npm install
```

### 3. Iniciar Servidor de Desarrollo

```bash
npm run dev
```

La aplicación estará disponible en: **http://localhost:3001**

---

## 🎯 Funcionalidades Implementadas

### ✅ Listado Paginado de Usuarios
- Tabla responsive con datos de usuarios
- Paginación con botones Anterior/Siguiente
- Información de página actual y total
- Estados de loading, error y vacío

### ✅ CRUD Completo
- **Crear**: Modal con formulario validado
- **Leer**: Listado y detalles en tabla
- **Actualizar**: Modal con datos pre-cargados
- **Eliminar**: Confirmación antes de borrar

### ✅ Exportación de Usuarios
- Descarga de CSV con todos los usuarios
- Indicador de loading durante la descarga
- Nombre de archivo con timestamp

### ✅ Validación de Formularios
- Validación en tiempo real con Zod
- Mensajes de error descriptivos
- Prevención de envíos duplicados

### ✅ Manejo de Estados
- Loading spinners mientras carga datos
- Mensajes de error amigables
- Notificaciones toast para acciones (crear, editar, eliminar)
- Estado vacío cuando no hay usuarios

### ✅ UX y Diseño
- Interfaz limpia y moderna con shadcn/ui
- Responsive design (mobile-first)
- Accesibilidad con componentes semánticos
- Animaciones sutiles y transiciones

---

## 🔍 Conceptos Clave

### React Query - Gestión de Datos del Servidor

React Query automatiza el manejo de datos remotos:

**Antes (sin React Query):**
```tsx
const [users, setUsers] = useState([]);
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);

useEffect(() => {
  setLoading(true);
  fetch('/api/users')
    .then(res => res.json())
    .then(data => setUsers(data))
    .catch(err => setError(err))
    .finally(() => setLoading(false));
}, []);
```

**Después (con React Query):**
```tsx
const { data, isLoading, error } = useUsers({ page: 1, pageSize: 10 });
```

### Zustand - Estado Global Simple

Para estado UI (no datos del servidor):

```tsx
// Definir store
export const useUserStore = create((set) => ({
  isDialogOpen: false,
  openDialog: () => set({ isDialogOpen: true }),
  closeDialog: () => set({ isDialogOpen: false }),
}));

// Usar en cualquier componente
const { isDialogOpen, openDialog } = useUserStore();
```

### shadcn/ui - Componentes Copiables

A diferencia de otras librerías UI (Material-UI, Chakra):
- Los componentes se **copian** a tu proyecto
- Tienes **control total** del código
- **Personalizables** al 100%
- Basados en **Radix UI** (accesibilidad)

---

## 🧪 Cómo Extender

### Agregar un Nuevo Campo al Usuario

1. **Actualizar tipos** (`lib/types.ts`):
```typescript
export interface User {
  // ...existentes
  phone?: string; // nuevo campo
}
```

2. **Actualizar esquema de validación** (`components/users/user-dialog.tsx`):
```typescript
const userSchema = z.object({
  // ...existentes
  phone: z.string().optional(),
});
```

3. **Agregar campo al formulario**:
```tsx
<FormField
  control={form.control}
  name="phone"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Teléfono</FormLabel>
      <FormControl>
        <Input {...field} />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>
```

4. **Agregar columna a la tabla** (`components/users/user-list.tsx`):
```tsx
<TableHead>Teléfono</TableHead>
// ...
<TableCell>{user.phone}</TableCell>
```

---

## 📚 Recursos de Aprendizaje

### Next.js
- [Documentación oficial](https://nextjs.org/docs)
- [Learn Next.js](https://nextjs.org/learn)

### React Query
- [Docs oficiales](https://tanstack.com/query/latest)
- [TkDodo's Blog](https://tkdodo.eu/blog/practical-react-query) (excelente recurso)

### Zustand
- [GitHub + Docs](https://github.com/pmndrs/zustand)

### shadcn/ui
- [Documentación](https://ui.shadcn.com/)
- [Componentes disponibles](https://ui.shadcn.com/docs/components)

### Tailwind CSS
- [Docs oficiales](https://tailwindcss.com/docs)
- [Cheat Sheet](https://nerdcave.com/tailwind-cheat-sheet)

---

## 🐛 Solución de Problemas

### Error: "Cannot connect to backend"
- Verificar que el backend esté corriendo en `http://localhost:3000`
- Verificar la variable `NEXT_PUBLIC_API_URL` en `.env.local`

### Error: "Hydration failed"
- Asegúrate de usar `"use client"` en componentes con interactividad
- Los componentes con `useState`, `useEffect`, eventos, etc. deben ser Client Components

### Estilos no se aplican
- Verificar que `globals.css` esté importado en `layout.tsx`
- Ejecutar `npm run dev` para reiniciar el servidor

---

## 📝 Scripts Disponibles

```bash
# Desarrollo
npm run dev

# Build para producción
npm run build

# Iniciar en producción
npm start

# Linter
npm run lint
```

---

## 🎨 Personalización de Estilos

Los colores y tema se configuran en `globals.css`:

```css
@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --primary: 222.2 47.4% 11.2%;
    /* ... más variables */
  }
}
```

Puedes usar el [Theme Generator](https://ui.shadcn.com/themes) de shadcn/ui.

---
