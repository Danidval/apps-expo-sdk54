/**
 * Pantalla de inicio de sesión.
 * Permite al usuario autenticarse con usuario y contraseña.
 * Almacena la sesión en SecureStore mediante el hook useSession
 * y redirige a la pantalla principal (tabs) si las credenciales son correctas.
 */

// Hooks de React: useState para manejar el estado local del formulario
import { useState } from 'react';
// Componentes de React Native para estructura, estilos, alertas e indicador de carga
import { View, StyleSheet, Alert, ActivityIndicator } from 'react-native';
// Navegación: router permite redirigir después del login
import { router } from 'expo-router';
// Componentes de UI reutilizables: Input personalizado y Button con variantes
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
// Hook personalizado que proporciona la función signIn para guardar la sesión
import { useSession } from '../../hooks/useSession';
// Función de la API que realiza la petición de login
import { login } from '../../services/api';
// Paleta de colores centralizada
import Colors from '../../constants/colors';

export default function LoginScreen() {
  // Estado para el nombre de usuario (campo de texto)
  const [username, setUsername] = useState('');
  // Estado para la contraseña (campo seguro)
  const [password, setPassword] = useState('');
  // Estado de carga: muestra indicador mientras se procesa la autenticación
  const [loading, setLoading] = useState(false);
  // Obtiene la función signIn del contexto de sesión (para guardar los datos del usuario)
  const { signIn } = useSession();

  /**
   * Maneja el envío del formulario de inicio de sesión.
   * Valida que los campos no estén vacíos, realiza la petición a la API,
   * guarda la sesión en caso de éxito y redirige a la pantalla principal.
   */
  const handleLogin = async () => {
    // Validación simple: ambos campos deben tener contenido no vacío
    if (!username.trim() || !password.trim()) {
      Alert.alert('Error', 'Usuario y contraseña son obligatorios');
      return;
    }

    // Activa el indicador de carga y deshabilita el botón
    setLoading(true);
    // Llama al endpoint de login con los datos ingresados
    const { status, data } = await login(username.trim(), password);
    setLoading(false);

    // Si la respuesta es exitosa (código 200) y tiene un mensaje
    if (status === 200 && data.message) {
      // Guarda la sesión (nombre completo y nombre de usuario) en SecureStore y contexto
      await signIn({ fullname: data.fullname, username });
      // Reemplaza la pantalla actual por las pestañas principales (no permite volver atrás)
      router.replace('/(tabs)');
    } else {
      // Muestra el error devuelto por el backend o un mensaje genérico
      Alert.alert('Error', data.error || 'Credenciales incorrectas');
    }
  };

  // Renderizado del formulario
  return (
    <View style={styles.container}>
      {/* Campo de usuario: sin auto-capitalización */}
      <Input
        placeholder="Usuario"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />
      {/* Campo de contraseña: oculta el texto (secureTextEntry) */}
      <Input
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      {/* Botón principal: cambia el texto según el estado de carga y se deshabilita mientras carga */}
      <Button
        title={loading ? 'Cargando...' : 'Iniciar sesión'}
        onPress={handleLogin}
        disabled={loading}
      />
      {/* Botón secundario que redirige a la pantalla de registro */}
      <Button
        title="Registrarse"
        onPress={() => router.push('/auth/register')}
        type="secondary"
      />
    </View>
  );
}

/**
 * Estilos de la pantalla de login.
 * El contenedor ocupa toda la pantalla, centra su contenido verticalmente,
 * aplica un padding lateral y el color de fondo definido en Colors.background.
 */
const styles = StyleSheet.create({
  container: {
    flex: 1,                       // Ocupa toda la altura disponible
    justifyContent: 'center',       // Centra los elementos verticalmente
    padding: 20,                   // Espaciado interior
    backgroundColor: Colors.background,
  },
});
