import { View, Text, StyleSheet } from 'react-native';
import { Button } from './ui/Button';
import { Curso } from '../types/Curso';

interface Props {
  curso: Curso;
  onEdit: () => void;
  onDelete: () => void;
}

export const CursoItem = ({ curso, onEdit, onDelete }: Props) => {
  // Convertimos a número de forma segura. Si no es válido o es un string, por defecto será 0.
  const precioNumerico = Number(curso.precio) || 0;

  return (
    <View style={styles.card}>
      <Text style={styles.titulo}>{curso.titulo}</Text>
      <Text style={styles.instructor}>👨‍🏫 {curso.instructor}</Text>
      
      {/* CORREGIDO: Usamos el precio numerico formateado a 2 decimales de forma segura */}
      <Text style={styles.precio}>
        💰 ${precioNumerico.toFixed(2)}
      </Text>
      
      <View style={styles.buttons}>
        <Button title="Editar" onPress={onEdit} type="secondary" />
        <Button title="Eliminar" onPress={onDelete} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: { backgroundColor: '#fff', borderRadius: 10, padding: 15, marginBottom: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 2, marginHorizontal: 10 },
  titulo: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  instructor: { fontSize: 14, color: '#666', marginTop: 5 },
  precio: { fontSize: 16, fontWeight: 'bold', color: '#28a745', marginTop: 5 },
  buttons: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10, gap: 10 },
});