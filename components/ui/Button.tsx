import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import Colors from '../../constants/colors';

interface ButtonProps {
  title: string;
  onPress: () => void;
  type?: 'primary' | 'secondary';
  disabled?: boolean;
  loading?: boolean;
}

export const Button = ({ title, onPress, type = 'primary', disabled = false, loading = false }: ButtonProps) => {
  return (
    <TouchableOpacity
      style={[styles.button, type === 'secondary' && styles.secondary, disabled && styles.disabled]}
      onPress={onPress}
      disabled={disabled || loading}
    >
      {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.text}>{title}</Text>}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: { backgroundColor: Colors.primary, padding: 12, borderRadius: 8, alignItems: 'center', marginVertical: 8 },
  secondary: { backgroundColor: Colors.secondary },
  disabled: { opacity: 0.5 },
  text: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});
