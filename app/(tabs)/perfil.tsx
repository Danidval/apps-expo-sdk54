/**
 * Pantalla de perfil del usuario (pestaña "Perfil").
 * Muestra los datos del usuario logueado (nombre completo y nombre de usuario)
 * y proporciona un botón para cerrar sesión.
 * El contenido se obtiene del contexto de sesión (useSession).
 */

// Componentes de React Native para estructura, texto, estilos y alertas
import { View, Text, StyleSheet, Alert } from 'react-native';
// Navegación: router permite redirigir después de cerrar sesión
import { router } from 'expo-router';
// Botón reutilizable con variantes de estilo
import { Button } from '../../components/ui/Button';
// Hook personalizado que devuelve la sesión actual y la función para cerrar sesión
import { useSession } from '../../hooks/useSession';
// Paleta de colores centralizada
import Colors from '../../constants/colors';

export default function PerfilScreen() {
  // Extrae los datos de la sesión (fullname, username) y la función signOut del contexto
  const { session, signOut } = useSession();

  /**
   * Maneja el cierre de sesión.
   * Muestra una alerta de confirmación antes de proceder.
   * Si el usuario confirma, elimina la sesión y redirige a la pantalla de login.
   */
  const handleLogout = async () => {
    Alert.alert('Cerrar sesión', '¿Estás seguro?', [
      { text: 'Cancelar', style: 'cancel' }, // Opción cancelar sin acción
      {
        text: 'Salir',
        style: 'destructive', // Estilo destructivo para enfatizar la acción irreversible
        onPress: async () => {
          await signOut();               // Elimina la sesión del almacenamiento seguro y del estado global
          router.replace('/auth/login'); // Reemplaza el historial de navegación y envía al login
        },
      },
    ]);
  };

  // Renderizado de la pantalla
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Bienvenido</Text>
      {/* Muestra el nombre completo o "Usuario" si no hay sesión (aunque siempre debería haberla) */}
      <Text style={styles.name}>{session?.fullname || 'Usuario'}</Text>
      {/* Muestra el nombre de usuario precedido por @ */}
      <Text style={styles.username}>@{session?.username}</Text>
      {/* Botón que ejecuta la función de cierre de sesión */}
      <Button title="Cerrar sesión" onPress={handleLogout} />
    </View>
  );
}

/**
 * Estilos de la pantalla de perfil.
 * - container: fondo, centrado horizontal y padding.
 * - label: texto de bienvenida (gris, tamaño mediano).
 * - name: nombre completo (grande, negrita, color primario).
 * - username: nombre de usuario (gris, tamaño pequeño, con @).
 */
const styles = StyleSheet.create({
  container: {
    flex: 1,                     // Ocupa toda la pantalla
    padding: 20,                // Espaciado interior
    backgroundColor: Colors.background, // Fondo claro definido en colors.ts
    alignItems: 'center',       // Centra los elementos horizontalmente
  },
  label: {
    fontSize: 16,
    color: Colors.gray,
    marginTop: 40,              // Separación desde el borde superior
  },
  name: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.primary,      // Color principal (morado)
    marginVertical: 10,         // Espaciado vertical arriba y abajo
  },
  username: {
    fontSize: 16,
    color: Colors.gray,
    marginBottom: 40,           // Separación antes del botón
  },
});
