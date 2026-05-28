/**
 * Pantalla raíz (index) de la aplicación.
 * Actúa como un enrutador inicial: verifica si hay una sesión activa
 * y redirige automáticamente a la pantalla correspondiente.
 * - Si hay sesión: redirige a la sección de pestañas principales (Cursos/Perfil)
 * - Si no hay sesión: redirige a la pantalla de inicio de sesión
 */

// Componente Redirect de Expo Router para realizar redirecciones declarativas
import { Redirect } from 'expo-router';
// Hook personalizado para acceder al estado de la sesión y carga
import { useSession } from '../hooks/useSession';

export default function Index() {
  // Obtiene los datos de la sesión y el indicador de carga desde el contexto
  const { session, isLoading } = useSession();

  // Mientras se verifica la sesión (cargando), no renderiza nada
  // Esto evita un "flash" de redirección o contenido incorrecto
  if (isLoading) return null;

  // Si ya hay un usuario autenticado, redirige a la pantalla principal (tabs)
  if (session) return <Redirect href="/(tabs)" />;

  // Si no hay sesión, redirige a la pantalla de inicio de sesión
  return <Redirect href="/auth/login" />;
}
