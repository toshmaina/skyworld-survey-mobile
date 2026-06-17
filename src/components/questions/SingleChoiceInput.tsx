import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Question } from '../../types/survey';

interface Props {
  question: Question;
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export default function SingleChoiceInput({ question, value, onChange, error }: Props) {
  const options = question.options?.option ?? [];

  return (
    <View style={styles.container}>
      {options.map((opt) => {
        const selected = value === opt.value;
        return (
          <TouchableOpacity
            key={opt.value}
            style={[styles.option, selected && styles.optionSelected]}
            onPress={() => onChange(opt.value)}
            activeOpacity={0.7}
          >
            <View style={[styles.radio, selected && styles.radioSelected]}>
              {selected && <View style={styles.radioDot} />}
            </View>
            <Text style={[styles.label, selected && styles.labelSelected]}>
              {opt.label}
            </Text>
          </TouchableOpacity>
        );
      })}
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 10 },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    backgroundColor: '#fff',
  },
  optionSelected: {
    borderColor: '#6366f1',
    backgroundColor: '#eef2ff',
  },
  radio: {
    width: 20, height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#d1d5db',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioSelected: { borderColor: '#6366f1' },
  radioDot: {
    width: 10, height: 10,
    borderRadius: 5,
    backgroundColor: '#6366f1',
  },
  label: { fontSize: 15, color: '#374151', flex: 1 },
  labelSelected: { color: '#4338ca', fontWeight: '500' },
  error: { fontSize: 12, color: '#ef4444', marginLeft: 4 },
});
