/**
 * Pantalla de edición de un curso existente.
 * Recibe el ID del curso como parámetro de la ruta (uso de useLocalSearchParams),
 * carga los datos del curso desde la API y permite modificar sus campos.
 * Al guardar, actualiza el curso mediante la API y regresa a la lista.
 */

// Hooks: useState para estado local, useEffect para cargar datos al montar
import { useState, useEffect } from 'react';
// Componentes de React Native: View para estructura, Alert para notificaciones,
// ScrollView para formularios largos, ActivityIndicator para carga
import { View, StyleSheet, Alert, ScrollView, ActivityIndicator } from 'react-native';
// Navegación: router para volver atrás, useLocalSearchParams para obtener el ID de la URL
import { router, useLocalSearchParams } from 'expo-router';
// Componentes UI reutilizables: Input (campo de texto) y Button (botón)
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
// Funciones de la API: getCursos (para obtener todos y filtrar) y updateCurso
import { getCursos, updateCurso } from '../../services/api';
// Paleta de colores centralizada
import Colors from '../../constants/colors';
// Tipo TypeScript para el objeto Curso
import { Curso } from '../../types/Curso';

export default function EditarCursoScreen() {
  // Obtiene el parámetro 'id' de la ruta (ej: /cursos/5) y lo tipa como string
  const { id } = useLocalSearchParams<{ id: string }>();

  // Estado para almacenar el objeto curso completo (útil para referencia)
  const [curso, setCurso] = useState<Curso | null>(null);
  // Estados para cada campo del formulario, inicializados vacíos hasta cargar los datos
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [instructor, setInstructor] = useState('');
  const [imagen, setImagen] = useState('');
  const [precio, setPrecio] = useState('');
  // Estado de carga inicial (true mientras se obtienen los datos)
  const [loading, setLoading] = useState(true);
  // Estado de guardado (true mientras se envía la actualización a la API)
  const [saving, setSaving] = useState(false);

  /**
   * Efecto que se ejecuta al montar el componente o cuando cambia el ID.
   * Carga todos los cursos desde la API, busca el que coincide con el ID
   * y llena los campos del formulario con sus valores.
   */
  useEffect(() => {
    const loadCurso = async () => {
      // Obtiene la lista completa de cursos (no hay endpoint individual por ID)
      const { status, data } = await getCursos();
      if (status === 200 && data.data) {
        // Busca el curso cuyo ID coincida con el parámetro (convertido a número)
        const found = data.data.find((c: Curso) => c.id === parseInt(id));
        if (found) {
          // Guarda el objeto completo (por si se necesita después)
          setCurso(found);
          // Inicializa los campos del formulario con los valores existentes
          setTitulo(found.titulo);
          setDescripcion(found.descripcion || ''); // Si es null, asigna string vacío
          setInstructor(found.instructor);
          setImagen(found.imagen || '');
          setPrecio(found.precio.toString());      // Convierte número a string para el Input
        } else {
          Alert.alert('Error', 'Curso no encontrado');
        }
      } else {
        Alert.alert('Error', 'No se pudo cargar el curso');
      }
      setLoading(false); // Finaliza el estado de carga
    };
    loadCurso();
  }, [id]); // Dependencia: si cambia el ID (no debería, pero por seguridad)

  /**
   * Maneja el envío del formulario para actualizar el curso.
   * Valida campos obligatorios (título, instructor, precio),
   * construye el objeto con los datos editados y llama a updateCurso.
   */
  const handleUpdate = async () => {
    // Validaciones
    if (!titulo.trim()) {
      Alert.alert('Error', 'El título es obligatorio');
      return;
    }
    if (!instructor.trim()) {
      Alert.alert('Error', 'El instructor es obligatorio');
      return;
    }
    if (!precio.trim() || isNaN(parseFloat(precio))) {
      Alert.alert('Error', 'Precio válido requerido');
      return;
    }

    // Activa el estado de guardado para mostrar indicador y deshabilitar botones
    setSaving(true);
    // Prepara el objeto con los datos actualizados
    const cursoData = {
      titulo: titulo.trim(),
      descripcion: descripcion.trim(),
      instructor: instructor.trim(),
      imagen: imagen.trim(),
      precio: parseFloat(precio),
    };
    // Llama a la API para actualizar el curso (método PUT)
    const { status, data } = await updateCurso(parseInt(id), cursoData);
    setSaving(false);

    if (status === 200) {
      Alert.alert('Éxito', 'Curso actualizado');
      router.back(); // Regresa a la pantalla anterior (lista de cursos)
    } else {
      Alert.alert('Error', data.error || 'No se pudo actualizar');
    }
  };

  // Muestra un indicador de carga mientras se obtienen los datos del curso
  if (loading) {
    return <ActivityIndicator size="large" color={Colors.primary} style={styles.center} />;
  }

  // Renderizado del formulario de edición dentro de un ScrollView para soportar contenido largo
  return (
    <ScrollView style={styles.container}>
      {/* Campo de título (obligatorio) */}
      <Input
        placeholder="Título *"
        value={titulo}
        onChangeText={setTitulo}
      />
      {/* Campo de descripción (multilínea) */}
      <Input
        placeholder="Descripción"
        value={descripcion}
        onChangeText={setDescripcion}
        multiline // Permite varias líneas de texto
      />
      {/* Campo de instructor (obligatorio) */}
      <Input
        placeholder="Instructor *"
        value={instructor}
        onChangeText={setInstructor}
      />
      {/* Campo para URL de imagen (opcional) */}
      <Input
        placeholder="URL de imagen"
        value={imagen}
        onChangeText={setImagen}
        autoCapitalize="none" // Las URLs normalmente no necesitan mayúsculas automáticas
      />
      {/* Campo de precio (solo números decimales) */}
      <Input
        placeholder="Precio *"
        value={precio}
        onChangeText={setPrecio}
        keyboardType="decimal-pad" // Muestra teclado numérico con punto decimal
      />
      {/* Botón de actualización: cambia de texto y se deshabilita mientras guarda */}
      <Button
        title={saving ? 'Guardando...' : 'Actualizar'}
        onPress={handleUpdate}
        disabled={saving}
      />
      {/* Botón para cancelar y volver sin guardar cambios */}
      <Button
        title="Cancelar"
        onPress={() => router.back()}
        type="secondary"
      />
    </ScrollView>
  );
}

/**
 * Estilos de la pantalla de edición.
 * container: fondo y padding para el formulario.
 * center: centra el ActivityIndicator (usado durante la carga).
 */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: Colors.background,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
