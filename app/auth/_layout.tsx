/**
 * Layout para las pantallas de autenticación (login y registro).
 * Define un stack navigator con dos rutas: login y register.
 * Cada pantalla tendrá un header con el título correspondiente.
 */

// Importa el componente Stack de Expo Router para crear navegación por pilas
import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    // Contenedor principal del stack de navegación
    <Stack>
      {/* Pantalla de inicio de sesión */}
      <Stack.Screen
        name="login"               // Nombre del archivo: app/auth/login.tsx
        options={{
          title: 'Iniciar Sesión', // Título que aparece en el header
        }}
      />
      {/* Pantalla de registro de nuevos usuarios */}
      <Stack.Screen
        name="register"            // Archivo: app/auth/register.tsx
        options={{
          title: 'Registrarse',    // Título del header
        }}
      />
    </Stack>
  );
}
