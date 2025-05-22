# Sistema de Gestión - Frontend Web

## 📋 Descripción General

Frontend web del Sistema de Gestión, desarrollado con React y TypeScript. Esta aplicación forma parte de un sistema integral que incluye componentes web y móvil, respaldados por una API REST.

## 🚀 Tecnologías Utilizadas

- **Framework**: React + TypeScript
- **UI/Estilos**: Tailwind CSS
- **Gestión de Estado**: Redux/Context API
- **Peticiones HTTP**: Axios
- **Enrutamiento**: React Router DOM
- **Formularios**: Formik + Yup
- **Desarrollo**: Vite (o especificar otra herramienta)

## 🛠️ Requisitos Previos

- Node.js (versión X.X.X o superior)
- npm (versión X.X.X) o yarn (versión X.X.X)
- Acceso al servidor de backend (API REST)

## ⚙️ Instalación

1. Clonar el repositorio:
   ```bash
   git clone https://github.com/usuario/sistema-gestion-frontend.git
   cd sistema-gestion-frontend
   ```

2. Instalar dependencias:
   ```bash
   npm install
   # o
   yarn install
   ```

3. Configurar variables de entorno:
   - Copiar el archivo `.env.example` a `.env.local`
   - Ajustar las variables según el entorno de desarrollo

4. Iniciar el servidor de desarrollo:
   ```bash
   npm run dev
   # o
   yarn dev
   ```

## 📁 Estructura de Carpetas

```
src/
├── assets/           # Recursos estáticos (imágenes, fuentes, etc.)
├── components/       # Componentes reutilizables
│   ├── common/       # Componentes comunes (botones, inputs, etc.)
│   ├── forms/        # Componentes de formularios
│   ├── layout/       # Componentes de estructura (header, sidebar, etc.)
│   └── ui/           # Componentes de interfaz específicos
├── config/           # Configuraciones globales
├── context/          # Contextos de React (si se utiliza Context API)
├── hooks/            # Custom hooks
├── pages/            # Componentes de páginas/rutas
├── redux/            # Store, reducers, actions, selectors (si se utiliza Redux)
│   ├── actions/
│   ├── reducers/
│   ├── selectors/
│   ├── slices/       # (si se utiliza Redux Toolkit)
│   └── store.ts
├── routes/           # Configuración de rutas
├── services/         # Servicios para comunicación con API
├── styles/           # Estilos globales o utils de Tailwind
├── types/            # Definiciones de tipos TypeScript
├── utils/            # Funciones utilitarias
├── App.tsx           # Componente principal
└── main.tsx          # Punto de entrada
```

## 🔄 Flujo de Trabajo de Desarrollo

1. **Ramas de Git**:
   - `main`: Código de producción
   - `develop`: Rama de desarrollo
   - `feature/nombre-caracteristica`: Para nuevas características
   - `bugfix/nombre-bug`: Para correcciones de errores

2. **Proceso de Commit**:
   - Utilizar commits semánticos: `feat:`, `fix:`, `docs:`, `style:`, `refactor:`, `test:`, `chore:`
   - Ejemplo: `feat: implementar sistema de autenticación`

3. **Pull Requests**:
   - Crear PR desde feature branches hacia develop
   - Requerir al menos 1 revisión antes de merge
   - Asegurar que todos los tests pasen

## 🧪 Testing

```bash
# Ejecutar todos los tests
npm run test

# Ejecutar tests con coverage
npm run test:coverage

# Ejecutar tests en modo watch
npm run test:watch
```

## 🔧 Comandos Disponibles

```bash
npm run dev          # Inicia el servidor de desarrollo
npm run build        # Construye la aplicación para producción
npm run preview      # Vista previa de la versión de producción
npm run lint         # Ejecuta el linter
npm run lint:fix     # Corrige errores de linting automáticamente
npm run format       # Formatea el código con Prettier
```

## 📦 Módulos Principales

### Gestión de Usuarios
- Registro
- Inicio de sesión
- Perfiles de usuario
- Gestión de roles y permisos

### Gestión de Eventos
- Creación y edición de eventos
- Listado y filtrado
- Detalles del evento

### Asistencia y Validaciones
- Registro de asistencia
- Validación de participantes
- QR o códigos de verificación

### Constancias
- Generación de constancias
- Plantillas personalizables
- Envío por correo electrónico

### Notificaciones
- Centro de notificaciones
- Preferencias de notificación

### Reportes y Análisis
- Dashboards interactivos
- Exportación de datos
- Visualización de estadísticas

### Administración y Configuración
- Panel de administración
- Configuraciones del sistema

## 🔐 Autenticación

El frontend utiliza JWT para la autenticación con el backend. Los tokens se almacenan en localStorage/sessionStorage y se envían en cada petición mediante un interceptor de Axios.

## 🌐 Integración con API

Las peticiones a la API se gestionan a través de servicios específicos utilizando Axios:

```typescript
// Ejemplo de servicio de autenticación
import axios from 'axios';
import { API_BASE_URL } from '../config';

export const authService = {
  login: async (credentials) => {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, credentials);
    return response.data;
  },
  // Otros métodos...
};
```

## 🌍 Internacionalización

El proyecto utiliza [biblioteca de i18n] para soportar múltiples idiomas:

- Español (predeterminado)
- Inglés
- [Otros idiomas soportados]

## 🎨 Tema y Personalización

Los estilos se gestionan principalmente con Tailwind CSS. La configuración del tema se encuentra en `tailwind.config.js`.

## 📱 Responsividad

La aplicación está diseñada para ser completamente responsive, siguiendo el enfoque mobile-first.

## ♿ Accesibilidad

El proyecto sigue las pautas WCAG 2.1 para garantizar que la aplicación sea accesible para todos los usuarios.

## 📚 Documentación Adicional

- [Guía de Estilo](./docs/style-guide.md)
- [Guía de Contribución](./docs/contributing.md)
- [Documentación de API](link-a-swagger-o-documentación)

## 🔍 Rendimiento y Optimización

- Code splitting mediante lazy loading
- Optimización de imágenes
- Memoización de componentes costosos
- Estrategias de caché

## 🤝 Colaboradores

- [Nombre del Colaborador 1](link-a-github)
- [Nombre del Colaborador 2](link-a-github)

## 📝 Licencia

[Tipo de Licencia] - Ver archivo [LICENSE](./LICENSE) para más detalles.
