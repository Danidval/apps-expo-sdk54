/**
 * Pantalla de registro de nuevos usuarios.
 * Permite crear una cuenta proporcionando nombre completo, nombre de usuario,
 * contraseña y confirmación de contraseña.
 * Al registrarse exitosamente, redirige a la pantalla de inicio de sesión.
 */

// Hooks de React: useState para manejar los campos del formulario
import { useState } from 'react';
// Componentes de React Native para la estructura, estilos, alertas e indicador de carga
import { View, StyleSheet, Alert, ActivityIndicator } from 'react-native';
// Navegación: router permite redirigir y retroceder
import { router } from 'expo-router';
// Componentes UI reutilizables: Input y Button
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
// Función de la API para registrar un nuevo usuario
import { register } from '../../services/api';
// Paleta de colores centralizada
import Colors from '../../constants/colors';

export default function RegisterScreen() {
  // Estado para cada campo del formulario
  const [fullname, setFullname] = useState('');       // Nombre completo del usuario
  const [username, setUsername] = useState('');       // Nombre de usuario único
  const [password, setPassword] = useState('');       // Contraseña
  const [confirmPassword, setConfirmPassword] = useState(''); // Confirmación de contraseña
  const [loading, setLoading] = useState(false);      // Estado de carga (para botón y evitar múltiples envíos)

  /**
   * Maneja el envío del formulario de registro.
   * Valida que todos los campos estén llenos,
   * que la contraseña y su confirmación coincidan,
   * llama a la API para registrar y redirige al login en caso de éxito.
   */
  const handleRegister = async () => {
    // Validación: campos obligatorios no pueden estar vacíos (ignorando espacios)
    if (!fullname.trim() || !username.trim() || !password.trim()) {
      Alert.alert('Error', 'Todos los campos son obligatorios');
      return;
    }
    // Validación: las contraseñas deben coincidir
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden');
      return;
    }

    // Activa el indicador de carga y deshabilita el botón
    setLoading(true);
    // Llama a la API de registro con los datos ingresados
    const { status, data } = await register(fullname.trim(), username.trim(), password);
    setLoading(false);

    // Si la respuesta es exitosa (código 201) y tiene un mensaje
    if (status === 201 && data.message) {
      Alert.alert('Éxito', 'Usuario registrado correctamente');
      // Reemplaza el historial de navegación por la pantalla de login
      router.replace('/auth/login');
    } else {
      // Muestra el error devuelto por el backend o un mensaje genérico
      Alert.alert('Error', data.error || 'No se pudo registrar');
    }
  };

  // Renderizado del formulario de registro
  return (
    <View style={styles.container}>
      {/* Campo: nombre completo */}
      <Input
        placeholder="Nombre completo"
        value={fullname}
        onChangeText={setFullname}
      />
      {/* Campo: nombre de usuario (sin auto-capitalización) */}
      <Input
        placeholder="Usuario"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />
      {/* Campo: contraseña (texto oculto) */}
      <Input
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      {/* Campo: confirmar contraseña (texto oculto) */}
      <Input
        placeholder="Confirmar contraseña"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />
      {/* Botón principal: cambia de texto y se deshabilita mientras carga */}
      <Button
        title={loading ? 'Cargando...' : 'Registrarse'}
        onPress={handleRegister}
        disabled={loading}
      />
      {/* Botón secundario que navega hacia atrás (volver al login) */}
      <Button
        title="Volver al login"
        onPress={() => router.back()}
        type="secondary"
      />
    </View>
  );
}

/**
 * Estilos de la pantalla de registro.
 * Contenedor centrado verticalmente, con padding lateral y fondo definido.
 */
const styles = StyleSheet.create({
  container: {
    flex: 1,                       // Ocupa toda la pantalla
    justifyContent: 'center',       // Centra los elementos verticalmente
    padding: 20,                   // Espaciado interior
    backgroundColor: Colors.background,
  },
});
