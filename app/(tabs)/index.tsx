/**
 * Pantalla principal de la aplicación (pestaña "Cursos").
 * Muestra una lista de cursos obtenidos desde una API REST.
 * Permite recargar la lista (pull-to-refresh), eliminar cursos,
 * y navegar a la pantalla de creación o edición.
 */

// Hooks de React: useState para estado local, useEffect y useCallback para efectos y memorización
import { useState, useEffect, useCallback } from 'react';
// Componentes de React Native para estructura, lista, alertas e indicadores de carga
import { View, FlatList, StyleSheet, Alert, ActivityIndicator, RefreshControl } from 'react-native';
// Navegación: router para cambiar de pantalla, useFocusEffect para ejecutar código cuando la pantalla toma el foco
import { router, useFocusEffect } from 'expo-router';
// Componente personalizado que representa cada curso en la lista
import { CursoItem } from '../../components/CursoItem';
// Componente de botón reutilizable (con variantes primary/secondary)
import { Button } from '../../components/ui/Button';
// Funciones de la API para obtener y eliminar cursos
import { getCursos, deleteCurso } from '../../services/api';
// Paleta de colores centralizada
import Colors from '../../constants/colors';
// Tipo TypeScript para los objetos Curso (id, titulo, instructor, precio, etc.)
import { Curso } from '../../types/Curso';

export default function CursosScreen() {
  // Estado para almacenar la lista de cursos obtenidos de la API
  const [cursos, setCursos] = useState<Curso[]>([]);
  // Estado de carga inicial (true mientras se cargan los cursos por primera vez)
  const [loading, setLoading] = useState(true);
  // Estado para controlar el indicador de refresco (pull-to-refresh) sin afectar la carga inicial
  const [refreshing, setRefreshing] = useState(false);

  /**
   * Función que obtiene los cursos desde la API y actualiza el estado.
   * Maneja errores mostrando una alerta al usuario.
   * Finaliza los estados de carga y refresco.
   */
  const loadCursos = async () => {
    // Llamada a la API: getCursos devuelve { status, data }
    const { status, data } = await getCursos();
    // Si la respuesta es exitosa (código 200) y tiene la propiedad 'data', actualiza la lista
    if (status === 200 && data.data) {
      setCursos(data.data);
    } else {
      // En caso de error, muestra un mensaje amigable
      Alert.alert('Error', 'No se pudieron cargar los cursos');
    }
    // Finaliza los indicadores de carga
    setLoading(false);
    setRefreshing(false);
  };

  /**
   * useFocusEffect: ejecuta el efecto cada vez que la pantalla recibe el foco.
   * Es útil para recargar la lista cuando se vuelve de la pantalla de creación/edición.
   * useCallback evita que se recree la función en cada renderizado.
   */
  useFocusEffect(
    useCallback(() => {
      loadCursos(); // Recarga la lista al enfocar la pantalla
    }, []) // Dependencias vacías: solo se ejecuta al montar y cada vez que se enfoca
  );

  /**
   * Maneja la eliminación de un curso.
   * Muestra una alerta de confirmación antes de proceder.
   * @param id - ID del curso a eliminar
   * @param titulo - Título del curso (para mostrar en el mensaje de confirmación)
   */
  const handleDelete = (id: number, titulo: string) => {
    Alert.alert('Eliminar', `¿Eliminar "${titulo}"?`, [
      { text: 'Cancelar', style: 'cancel' }, // Opción cancelar sin acción
      {
        text: 'Eliminar',
        style: 'destructive', // Estilo destructivo para enfatizar la acción peligrosa
        onPress: async () => {
          setLoading(true); // Muestra indicador de carga mientras se procesa la solicitud
          const { status } = await deleteCurso(id); // Llama a la API para eliminar
          setLoading(false);
          if (status === 200) { // Éxito
            Alert.alert('Éxito', 'Curso eliminado');
            loadCursos(); // Recarga la lista actualizada
          } else {
            Alert.alert('Error', 'No se pudo eliminar');
          }
        },
      },
    ]);
  };

  /**
   * Función que se ejecuta al hacer pull-to-refresh.
   * Activa el estado de refresco y vuelve a cargar los cursos.
   */
  const onRefresh = () => {
    setRefreshing(true);
    loadCursos();
  };

  // Mientras carga por primera vez y no hay cursos, muestra un indicador de carga centrado
  if (loading && cursos.length === 0) {
    return <ActivityIndicator size="large" color={Colors.primary} style={styles.center} />;
  }

  // Renderizado principal: lista de cursos con botón flotante para agregar
  return (
    <View style={styles.container}>
      {/* FlatList: componente eficiente para listas grandes */}
      <FlatList
        data={cursos}                         // Datos a mostrar
        keyExtractor={(item) => item.id.toString()} // Clave única para cada elemento (usando el ID como string)
        refreshControl={                      // Agrega funcionalidad de pull-to-refresh
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        renderItem={({ item }) => (          // Renderiza cada curso usando el componente CursoItem
          <CursoItem
            curso={item}
            onEdit={() => router.push(`/cursos/${item.id}`)} // Navega a la pantalla de edición con el ID
            onDelete={() => handleDelete(item.id, item.titulo)} // Llama a la función de eliminación
          />
        )}
        // Componente que se muestra cuando la lista está vacía
        ListEmptyComponent={
          <View style={styles.center}>
            <Button title="No hay cursos" onPress={loadCursos} type="secondary" />
          </View>
        }
      />
      {/* Botón flotante (FAB) para agregar un nuevo curso */}
      <View style={styles.fab}>
        <Button title="+ Agregar" onPress={() => router.push('/cursos/crear')} />
      </View>
    </View>
  );
}

/**
 * Estilos de la pantalla.
 * Se usa StyleSheet.create para mejorar el rendimiento y tener autocompletado.
 */
const styles = StyleSheet.create({
  // Contenedor principal ocupa toda la pantalla con el color de fondo definido en Colors.background
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  // Estilo para centrar contenido (usado en el indicador de carga y en la lista vacía)
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  // Botón flotante: posición absoluta en la esquina inferior derecha
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
});
