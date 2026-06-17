import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Question } from '../../types/survey';

interface Props {
  question: Question;
  value: string[];
  onChange: (value: string[]) => void;
  error?: string;
}

export default function MultipleChoiceInput({ question, value, onChange, error }: Props) {
  const options = question.options?.option ?? [];
  const selected = value ?? [];

  const toggle = (optValue: string) => {
    if (selected.includes(optValue)) {
      onChange(selected.filter((v) => v !== optValue));
    } else {
      onChange([...selected, optValue]);
    }
  };

  return (
    <View style={styles.container}>
      {options.map((opt) => {
        const isSelected = selected.includes(opt.value);
        return (
          <TouchableOpacity
            key={opt.value}
            style={[styles.option, isSelected && styles.optionSelected]}
            onPress={() => toggle(opt.value)}
            activeOpacity={0.7}
          >
            <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
              {isSelected && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <Text style={[styles.label, isSelected && styles.labelSelected]}>
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
  checkbox: {
    width: 20, height: 20,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: '#d1d5db',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxSelected: { borderColor: '#6366f1', backgroundColor: '#6366f1' },
  checkmark: { color: '#fff', fontSize: 13, fontWeight: '700' },
  label: { fontSize: 15, color: '#374151', flex: 1 },
  labelSelected: { color: '#4338ca', fontWeight: '500' },
  error: { fontSize: 12, color: '#ef4444', marginLeft: 4 },
});
