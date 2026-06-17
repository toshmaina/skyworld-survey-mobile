import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { Question } from '../../types/survey';

interface Props {
  question: Question;
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export default function EmailInput({ question, value, onChange, error }: Props) {
  return (
    <View style={styles.container}>
      <TextInput
        style={[styles.input, error ? styles.inputError : null]}
        value={value}
        onChangeText={onChange}
        placeholder="email@example.com"
        placeholderTextColor="#9ca3af"
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="next"
      />
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 6 },
  input: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
    color: '#111827',
    backgroundColor: '#fff',
  },
  inputError: { borderColor: '#ef4444' },
  error: { fontSize: 12, color: '#ef4444', marginLeft: 4 },
});
