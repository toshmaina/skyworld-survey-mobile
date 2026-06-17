import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { Question } from '../../types/survey';

interface Props {
  question: Question;
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export default function LongTextInput({ question, value, onChange, error }: Props) {
  return (
    <View style={styles.container}>
      <TextInput
        style={[styles.input, error ? styles.inputError : null]}
        value={value}
        onChangeText={onChange}
        placeholder={question.description ?? 'Type your answer...'}
        placeholderTextColor="#9ca3af"
        multiline
        numberOfLines={5}
        textAlignVertical="top"
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
    minHeight: 120,
  },
  inputError: { borderColor: '#ef4444' },
  error: { fontSize: 12, color: '#ef4444', marginLeft: 4 },
});
