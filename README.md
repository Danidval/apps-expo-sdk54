# CursosApp – Aplicación móvil para gestión de cursos

Aplicación desarrollada con **Expo SDK 54** (React Native) y **TypeScript** que permite gestionar cursos académicos. Consume una API REST desarrollada en PHP.

## ✨ Características

- Registro e inicio de sesión de usuarios.
- Listado de cursos con desplazamiento y recarga (pull‑to‑refresh).
- Creación, edición y eliminación de cursos.
- Persistencia de sesión con `expo-secure-store`.
- Navegación protegida (si no hay sesión, redirige al login).
- Interfaz con pestañas (tabs) y componentes reutilizables.

## 🛠️ Tecnologías utilizadas

- **Expo SDK 54**
- **Expo Router** (enrutamiento basado en archivos)
- **TypeScript**
- **expo-secure-store** (almacenamiento seguro de la sesión)
- **Fetch API** para consumir el backend

## 📦 Instalación y configuración

### Requisitos previos

- Node.js 18 o superior
- Expo CLI (`npx expo`)
- Un dispositivo Android con la app **Expo Go** instalada (o un emulador)

### Pasos para ejecutar en modo desarrollo

1. Clonar el repositorio:
   ```bash
   git clone https://github.com/Danidval/apps-expo-sdk54.git
   cd apps-expo-sdk54
   ```

2. Instalar dependencias:
   ```bash
   npm install
   ```

3. Configurar la URL del backend:
   Edita el archivo `services/api.ts` y cambia la constante `IP` por la dirección IP de tu computadora donde corre XAMPP (debe ser la misma red WiFi que tu celular):
   ```ts
   const IP = '192.168.1.35'; // Cambia por tu IP local
   ```

4. Iniciar el servidor de desarrollo:
   ```bash
   npx expo start
   ```

5. Escanear el código QR con la aplicación **Expo Go** en tu celular.

## 📱 Generación del APK (para entrega)

Para generar el archivo APK firmado, utiliza **EAS Build** (compilación en la nube):

```bash
npm install -g eas-cli
eas login
eas init
eas build:configure > Android
eas build -p android --profile preview
```

El APK se descargará desde el enlace que proporciona EAS.

## 🧪 Pruebas realizadas

- **Login**: credenciales correctas (usuario `david.posada`, contraseña `123`) → acceso exitoso. Credenciales incorrectas → mensaje de error.
- **Registro**: nuevo usuario → redirige a login y permite iniciar sesión.
- **Listado de cursos**: carga todos los cursos desde la API, permite recargar con pull‑to‑refresh.
- **Crear curso**: campos obligatorios validados; al guardar, el curso aparece en la lista.
- **Editar curso**: se cargan los datos existentes; al actualizar, los cambios persisten.
- **Eliminar curso**: solicita confirmación; tras eliminar, la lista se actualiza.
- **Persistencia de sesión**: al cerrar y volver a abrir la app, mantiene la sesión activa.
- **Cierre de sesión**: limpia el almacenamiento y redirige al login.

## 📁 Estructura del proyecto

```
CursosApp/
├── app/                          # Pantallas y layouts (Expo Router)
│   ├── _layout.tsx               # Layout raíz
│   ├── index.tsx                 # Página de inicio / redirección
│   ├── modal.tsx                 # Modal global
│   ├── (tabs)/                   # Pestañas: listado de cursos y perfil
│   │   ├── _layout.tsx
│   │   ├── index.tsx             # Listado de cursos
│   │   ├── explore.tsx           # Pantalla explorar
│   │   └── perfil.tsx            # Perfil del usuario
│   ├── auth/                     # Login y registro
│   │   ├── _layout.tsx
│   │   ├── login.tsx
│   │   └── register.tsx
│   └── cursos/                   # Crear y editar curso
│       ├── [id].tsx              # Editar curso
│       └── crear.tsx             # Crear curso
├── components/                   # Componentes reutilizables
│   ├── CursoItem.tsx
│   ├── ui/                       # Componentes base (Button, Input, etc.)
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   └── ...
│   └── ...
├── hooks/                        # Hooks personalizados
│   ├── useSession.tsx            # Sesión con SecureStore
│   └── ...
├── services/                     # Llamadas a la API
│   └── api.ts
├── constants/                    # Colores y temas
│   ├── colors.ts
│   └── theme.ts
├── types/                        # Definiciones TypeScript
│   └── Curso.ts
├── assets/                       # Imágenes e iconos
│   ├── images/
│   └── expo.icon/
├── app.json
├── tsconfig.json
├── eslint.config.js
└── package.json
```

## 🌐 Backend utilizado

Esta aplicación móvil consume una API REST desarrollada en PHP. El código fuente del backend se encuentra en el siguiente repositorio de GitHub:

- **Repositorio del Backend:** [evidencia-login-php (rama feature/ev03-crud-cursos)](https://github.com/Danidval/evidencia-login-php/tree/feature/ev03-crud-cursos)

**Características del Backend:**
- Autenticación de usuarios (registro e inicio de sesión).
- CRUD completo de cursos.
- Desarrollado con PHP y MySQL, siguiendo una arquitectura MVC.
- Incluye una interfaz web de prueba.

**Endpoints principales:**
- `POST /api/register.php` → Registro de usuarios.
- `POST /api/login.php` → Inicio de sesión.
- `GET /api/cursos.php` → Obtener todos los cursos.
- `POST /api/cursos.php` → Crear un curso.
- `PUT /api/cursos.php?id={id}` → Actualizar un curso.
- `DELETE /api/cursos.php?id={id}` → Eliminar un curso.

> **Nota:** La IP de la API debe configurarse en el archivo `services/api.ts` de esta aplicación, reemplazando el valor de ejemplo por la IP del servidor donde se aloja el backend.

## 👤 Autor

**Danid Esneider Vallejos Almeida** – Aprendiz – Análisis y Desarrollo de Software (ADSO) – SENA 2026

## 📄 Evidencia

Este proyecto corresponde a la evidencia **GA8-220501096-AA2-EV02** – APK (desarrollar módulos móvil según requerimientos del proyecto).
```
