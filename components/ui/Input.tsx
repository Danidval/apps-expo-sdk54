import { TextInput, StyleSheet, TextInputProps } from 'react-native';
import Colors from '../../constants/colors';

export const Input = (props: TextInputProps) => {
  return <TextInput style={styles.input} placeholderTextColor={Colors.gray} {...props} />;
};

const styles = StyleSheet.create({
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, marginBottom: 12, fontSize: 16, backgroundColor: '#fff' },
});
