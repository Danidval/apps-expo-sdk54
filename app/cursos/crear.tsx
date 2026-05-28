/**
 * Pantalla para crear un nuevo curso.
 * Muestra un formulario con los campos: título, descripción, instructor,
 * URL de imagen opcional y precio.
 * Al guardar, envía los datos a la API y, si es exitoso, regresa a la lista de cursos.
 */

// Hooks de React: useState para manejar el estado del formulario
import { useState } from 'react';
// Componentes de React Native: View para contenedor, Alert para mensajes, ScrollView para formularios largos
import { View, StyleSheet, Alert, ScrollView } from 'react-native';
// Navegación: router permite volver atrás después de crear el curso
import { router } from 'expo-router';
// Componentes UI reutilizables: Input (campo de texto) y Button (botón)
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
// Función de la API para crear un nuevo curso
import { createCurso } from '../../services/api';
// Paleta de colores centralizada
import Colors from '../../constants/colors';

export default function CrearCursoScreen() {
  // Estados para cada campo del formulario
  const [titulo, setTitulo] = useState('');           // Título del curso (obligatorio)
  const [descripcion, setDescripcion] = useState(''); // Descripción (opcional)
  const [instructor, setInstructor] = useState('');   // Nombre del instructor (obligatorio)
  const [imagen, setImagen] = useState('');           // URL de la imagen (opcional)
  const [precio, setPrecio] = useState('');           // Precio del curso (obligatorio, se guarda como string para el input)
  const [loading, setLoading] = useState(false);      // Estado de carga (evita envíos múltiples y muestra indicador)

  /**
   * Maneja el guardado del nuevo curso.
   * Valida que los campos obligatorios no estén vacíos,
   * construye el objeto con los datos del formulario,
   * llama a la API de creación y, en caso de éxito, regresa a la pantalla anterior.
   */
  const handleSave = async () => {
    // Validación: título no puede estar vacío
    if (!titulo.trim()) {
      Alert.alert('Error', 'El título es obligatorio');
      return;
    }
    // Validación: instructor no puede estar vacío
    if (!instructor.trim()) {
      Alert.alert('Error', 'El instructor es obligatorio');
      return;
    }
    // Validación: precio debe ser un número válido
    if (!precio.trim() || isNaN(parseFloat(precio))) {
      Alert.alert('Error', 'Precio válido requerido');
      return;
    }

    // Activa el estado de carga (deshabilita botón y muestra "Guardando...")
    setLoading(true);

    // Prepara el objeto con los datos del curso a enviar a la API
    const cursoData = {
      titulo: titulo.trim(),
      descripcion: descripcion.trim(),
      instructor: instructor.trim(),
      imagen: imagen.trim(),
      precio: parseFloat(precio),        // Convierte el string a número decimal
      id_creador: 1,                    // Fijo: ID del usuario creador (se puede mejorar obteniendo de la sesión)
    };

    // Llama a la API para crear el curso (método POST)
    const { status, data } = await createCurso(cursoData);
    setLoading(false);

    // La API puede responder con 201 (Created) o 200 (OK) según la implementación
    if (status === 201 || status === 200) {
      Alert.alert('Éxito', 'Curso creado');
      router.back(); // Regresa a la pantalla anterior (lista de cursos)
    } else {
      // Muestra el mensaje de error devuelto por el backend o uno genérico
      Alert.alert('Error', data.error || 'No se pudo crear');
    }
  };

  // Renderizado del formulario dentro de un ScrollView (útil si el contenido excede la pantalla)
  return (
    <ScrollView style={styles.container}>
      {/* Campo: Título (obligatorio) */}
      <Input
        placeholder="Título *"
        value={titulo}
        onChangeText={setTitulo}
      />
      {/* Campo: Descripción (multilínea, opcional) */}
      <Input
        placeholder="Descripción"
        value={descripcion}
        onChangeText={setDescripcion}
        multiline
      />
      {/* Campo: Instructor (obligatorio) */}
      <Input
        placeholder="Instructor *"
        value={instructor}
        onChangeText={setInstructor}
      />
      {/* Campo: URL de la imagen (opcional, sin auto-capitalización) */}
      <Input
        placeholder="URL de imagen"
        value={imagen}
        onChangeText={setImagen}
        autoCapitalize="none"
      />
      {/* Campo: Precio (solo números decimales, obligatorio) */}
      <Input
        placeholder="Precio *"
        value={precio}
        onChangeText={setPrecio}
        keyboardType="decimal-pad"   // Teclado numérico con punto decimal
      />
      {/* Botón principal: cambia de texto y se deshabilita mientras se guarda */}
      <Button
        title={loading ? 'Guardando...' : 'Guardar'}
        onPress={handleSave}
        disabled={loading}
      />
      {/* Botón secundario para cancelar y volver sin crear el curso */}
      <Button
        title="Cancelar"
        onPress={() => router.back()}
        type="secondary"
      />
    </ScrollView>
  );
}

/**
 * Estilos de la pantalla de creación de curso.
 * container: fondo, padding y ocupación total de la pantalla.
 */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: Colors.background,
  },
});
