# Exam Prep AI - Frontend

Cliente web de usuario para la plataforma Exam Prep AI, desarrollado con Vue 3, Vite, TypeScript y la biblioteca de componentes Vuetify.

---

## Stack Tecnologico

- **Framework:** Vue 3 (Composition API, `<script setup>`)
- **Herramienta de Compilacion:** Vite
- **Lenguaje:** TypeScript
- **Libreria de UI:** Vuetify 3
- **Iconografia:** Material Design Icons (`@mdi/font`)
- **Gestion de Estado:** Pinia
- **Enrutamiento:** Vue Router 4
- **Cliente HTTP:** Axios
- **Servicio de Autenticacion:** Supabase JS SDK
- **Gestor de Paquetes:** pnpm

---

## Estructura del Proyecto

```text
exam-prep-ai-fronted/
├── public/                     # Archivos estaticos publicos
├── src/
│   ├── assets/                 # Recursos visuales y fuentes
│   ├── components/             # Componentes modulares y reutilizables
│   ├── layouts/                # Plantillas principales de navegacion
│   ├── pages/                  # Vistas de la aplicacion (Dashboard, Examenes, Archivos)
│   ├── plugins/                # Configuracion de Vuetify, Pinia y Router
│   ├── router/                 # Rutas y guardias de navegacion
│   ├── services/               # Clientes API y comunicacion con Backend y Supabase
│   ├── stores/                 # Estados globales con Pinia
│   ├── styles/                 # Estilos globales y variables de diseño
│   ├── App.vue                 # Componente raiz
│   └── main.ts                 # Punto de entrada de la aplicacion
├── index.html                  # Plantilla HTML base
├── package.json                # Definicion de dependencias y scripts de ejecucion
└── vite.config.mts             # Configuracion del empaquetador Vite
```

---

## Configuracion y Variables de Entorno

Copie la plantilla de variables de entorno y configure los parametros correspondientes:

```bash
cp .env.example .env
```

Campos requeridos en `.env`:
```env
VITE_API_URL=http://localhost:8000/api/v1
BASE_URL=http://localhost:5173
VITE_APP_NAME=Exam Prep AI
VITE_SUPABASE_URL=https://<tu-proyecto-supabase>.supabase.co
VITE_SUPABASE_ANON_KEY=<tu-supabase-anon-key>
```

---

## Instalacion y Ejecucion

### 1. Instalacion de dependencias
```bash
pnpm install
```

### 2. Servidor de desarrollo
```bash
pnpm dev
```
La aplicacion estara disponible en `http://localhost:5173`.

### 3. Comprobacion de tipos
```bash
pnpm run type-check
```

### 4. Compilacion para produccion
```bash
pnpm run build
```
Los artefactos estaticos optimizados se generaran en el directorio `dist/`.

### 5. Previsualizacion local del build de produccion
```bash
pnpm run preview
```

### 6. Analisis estatico de codigo (Linter)
```bash
pnpm run lint
pnpm run lint:fix
```

---

## Despliegue en Produccion

El frontend puede desplegarse de forma gratuita en plataformas para sitios estaticos (SPA):

- **Vercel:** Importe el repositorio seleccionando el preajuste `Vite`, comando de construccion `pnpm build`, y directorio de salida `dist`.
- **Cloudflare Pages:** Conecte el repositorio, configure el directorio raiz y especifique `pnpm build` como comando de salida.
- **Netlify:** Configure la publicacion de la carpeta `dist/` tras ejecutar `pnpm build`.

Recuerde configurar las variables de entorno (`VITE_API_URL`, `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`) en el panel de control del proveedor de alojamiento elegido.
