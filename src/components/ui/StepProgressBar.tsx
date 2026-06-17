import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface Props {
  current: number;   // 1-indexed
  total: number;
}

export default function StepProgressBar({ current, total }: Props) {
  const percent = (current / total) * 100;

  return (
    <View style={styles.container}>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${percent}%` }]} />
      </View>
      <Text style={styles.label}>
        Question {current} of {total}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 6 },
  track: {
    height: 4,
    backgroundColor: '#e5e7eb',
    borderRadius: 2,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    backgroundColor: '#6366f1',
    borderRadius: 2,
  },
  label: { fontSize: 12, color: '#9ca3af', textAlign: 'right' },
});
