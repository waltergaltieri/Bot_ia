# 🤖 Bot_ia - Sistema Multi-Tenant de Gestión de Redes Sociales

## 📋 Descripción

Bot_ia es un sistema completo de gestión de redes sociales diseñado para empresas multi-sucursal. Permite administrar contenido, analizar métricas y gestionar equipos de trabajo de manera eficiente.

## 🏗️ Arquitectura

### Frontend
- **React 18** con TypeScript
- **Vite** como bundler
- **Tailwind CSS** para estilos
- **React Query** para gestión de estado
- **React Router** para navegación
- **Recharts** para gráficos y visualizaciones

### Backend
- **Node.js** con TypeScript
- **Express.js** como framework
- **Supabase** como base de datos
- **JWT** para autenticación

## 👥 Roles de Usuario

### 1. **Super Admin**
- Administración del sistema completo
- Gestión de ventas y facturación
- Configuración global del sistema
- Análisis de resultados generales

### 2. **Branch Manager**
- Gestión de múltiples sucursales
- Análisis de métricas por sucursal
- Vista detallada de equipos y empleados
- Resultados generales con filtros avanzados

### 3. **Manager**
- Gestión de una sucursal específica
- Vinculación de redes sociales
- Análisis de equipo local
- Publicación de contenido

### 4. **Employee**
- Acceso a información personal
- Gestión de redes sociales asignadas
- Visualización de métricas individuales

## 🚀 Características Principales

### 📊 Analytics Avanzados
- Métricas en tiempo real
- Gráficos interactivos
- Filtros por sucursal, equipo y período
- Comparativas de rendimiento
- Exportación de datos

### 👥 Gestión de Equipos
- Creación y administración de equipos
- Asignación de roles y permisos
- Seguimiento de performance individual
- Comunicación interna

### 📱 Gestión de Redes Sociales
- Vinculación de múltiples plataformas
- Programación de publicaciones
- Análisis de engagement
- Gestión de contenido

### 🏢 Multi-Sucursal
- Gestión independiente por sucursal
- Métricas específicas por ubicación
- Comparativas entre sucursales
- Administración centralizada

## 🛠️ Instalación

### Prerrequisitos
- Node.js 18+ 
- npm o yarn
- Git

### Pasos de Instalación

1. **Clonar el repositorio**
```bash
git clone git@github.com:waltergaltieri/Bot_ia.git
cd Bot_ia
```

2. **Instalar dependencias del Frontend**
```bash
cd frontend
npm install
```

3. **Instalar dependencias del Backend**
```bash
cd ../backend
npm install
```

4. **Configurar variables de entorno**
```bash
# En backend/.env
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
JWT_SECRET=your_jwt_secret
```

5. **Ejecutar el proyecto**
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

## 🧪 Cuentas de Prueba

### Super Admin
- **Email**: `superadmin@global.com`
- **Contraseña**: Cualquier contraseña
- **Funcionalidades**: Administración completa del sistema

### Branch Manager
- **Email**: `admin@techstart.com`
- **Contraseña**: Cualquier contraseña
- **Funcionalidades**: Gestión de sucursales y métricas

### Manager
- **Email**: `manager@techstart.com`
- **Contraseña**: Cualquier contraseña
- **Funcionalidades**: Gestión de sucursal específica

### Employee
- **Email**: `lucia.ventas@techstart.com`
- **Contraseña**: Cualquier contraseña
- **Funcionalidades**: Gestión personal y redes sociales

## 📁 Estructura del Proyecto

```
Bot_ia/
├── frontend/                 # Aplicación React
│   ├── src/
│   │   ├── components/      # Componentes reutilizables
│   │   ├── pages/          # Páginas de la aplicación
│   │   ├── context/        # Contextos de React
│   │   ├── services/       # Servicios y APIs
│   │   ├── hooks/          # Custom hooks
│   │   ├── types/          # Tipos TypeScript
│   │   └── utils/          # Utilidades
│   ├── public/             # Archivos públicos
│   └── package.json
├── backend/                 # API Node.js
│   ├── src/
│   │   ├── routes/         # Rutas de la API
│   │   ├── middleware/     # Middlewares
│   │   ├── services/       # Servicios
│   │   ├── types/          # Tipos TypeScript
│   │   └── utils/          # Utilidades
│   └── package.json
├── docker-compose.yml      # Configuración Docker
└── README.md
```

## 🎨 Características de UI/UX

### Diseño Moderno
- Interfaz limpia y profesional
- Gradientes y efectos visuales
- Animaciones suaves
- Responsive design

### Experiencia de Usuario
- Navegación intuitiva
- Filtros avanzados
- Gráficos interactivos
- Feedback visual inmediato

### Accesibilidad
- Contraste adecuado
- Navegación por teclado
- Etiquetas descriptivas
- Compatibilidad con lectores de pantalla

## 🔧 Tecnologías Utilizadas

### Frontend
- **React 18**: Biblioteca de UI
- **TypeScript**: Tipado estático
- **Vite**: Build tool rápido
- **Tailwind CSS**: Framework CSS
- **React Query**: Gestión de estado
- **React Router**: Enrutamiento
- **Recharts**: Gráficos
- **Lucide React**: Iconos
- **React Hook Form**: Formularios
- **React Hot Toast**: Notificaciones

### Backend
- **Node.js**: Runtime de JavaScript
- **Express.js**: Framework web
- **TypeScript**: Tipado estático
- **Supabase**: Base de datos y autenticación
- **JWT**: Tokens de autenticación
- **Cors**: Middleware CORS
- **Helmet**: Seguridad

## 🚀 Despliegue

### Frontend (Vercel/Netlify)
```bash
cd frontend
npm run build
```

### Backend (Railway/Heroku)
```bash
cd backend
npm run build
npm start
```

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 👨‍💻 Autor

**Walter Galtieri**
- GitHub: [@waltergaltieri](https://github.com/waltergaltieri)

## 🙏 Agradecimientos

- Equipo de desarrollo
- Comunidad de React
- Contribuidores de las librerías utilizadas

---

⭐ **¡No olvides darle una estrella al proyecto si te gustó!** 