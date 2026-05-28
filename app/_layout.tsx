/**
 * Layout raíz de la aplicación.
 * Configura la navegación principal (Stack) y envuelve toda la app con el proveedor de sesión.
 * Protege las rutas: si no hay sesión, redirige automáticamente a /auth/login.
 */

// Importa componentes de navegación de Expo Router: Stack para navegación por pilas, router para redirigir
import { Stack, router } from 'expo-router';
// Hook de React para ejecutar efectos secundarios (como la redirección al cargar)
import { useEffect } from 'react';
// Proveedor y hook personalizado para manejar la sesión (contexto + SecureStore)
import { SessionProvider, useSession } from '../hooks/useSession';

/**
 * Componente interno que contiene la lógica de navegación y protección de rutas.
 * Se define por separado para poder usar el hook useSession dentro del contexto.
 */
function RootLayoutNav() {
  // Obtiene los datos de la sesión y el indicador de carga desde el contexto
  const { session, isLoading } = useSession();

  /**
   * Efecto que se ejecuta cada vez que cambian los valores de session o isLoading.
   * Si ya terminó de cargar la sesión (isLoading === false) y no hay usuario (session === null),
   * redirige a la pantalla de inicio de sesión.
   */
  useEffect(() => {
    if (!isLoading && !session) {
      router.replace('/auth/login');   // Reemplaza el historial para que no pueda volver atrás
    }
  }, [session, isLoading]);

  // Mientras se verifica la sesión (cargando), no renderiza nada (evita pantalla vacía o flash)
  if (isLoading) return null;

  // Define el stack de navegación principal
  return (
    <Stack>
      {/* Pestañas principales (Cursos y Perfil) – se muestra cuando hay sesión */}
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      {/* Rutas de autenticación (login, registro) – se muestra cuando NO hay sesión */}
      <Stack.Screen name="auth" options={{ headerShown: false }} />
      {/* Rutas de cursos (crear, editar) – pueden estar anidadas dentro de tabs o auth */}
      <Stack.Screen name="cursos" options={{ headerShown: false }} />
    </Stack>
  );
}

/**
 * Componente principal del layout raíz.
 * Envuelve toda la aplicación con SessionProvider para que el contexto de sesión
 * esté disponible en cualquier componente hijo.
 */
export default function RootLayout() {
  return (
    <SessionProvider>
      <RootLayoutNav />
    </SessionProvider>
  );
}
