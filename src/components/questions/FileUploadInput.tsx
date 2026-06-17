import React from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, Alert
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { Question, FileAsset } from '../../types/survey';

interface Props {
  question: Question;
  value: FileAsset[];
  onChange: (value: FileAsset[]) => void;
  error?: string;
}

export default function FileUploadInput({ question, value, onChange, error }: Props) {
  const files = value ?? [];
  const multiple = question.fileProperties?.multiple ?? false;
  const maxSizeMB = question.fileProperties?.maxFileSize ?? 1;
  const maxSizeBytes = maxSizeMB * 1024 * 1024;

  const pickFiles = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf',
        multiple,
        copyToCacheDirectory: true,
      });

      if (result.canceled) return;

      const picked: FileAsset[] = result.assets
        .filter((a) => {
          if (a.size && a.size > maxSizeBytes) {
            Alert.alert('File too large', `${a.name} exceeds ${maxSizeMB}MB limit`);
            return false;
          }
          return true;
        })
        .map((a) => ({
          uri: a.uri,
          name: a.name,
          mimeType: a.mimeType ?? 'application/pdf',
          size: a.size,
        }));

      onChange(multiple ? [...files, ...picked] : picked);
    } catch {
      Alert.alert('Error', 'Could not open file picker');
    }
  };

  const removeFile = (index: number) => {
    onChange(files.filter((_, i) => i !== index));
  };

  return (
    <View style={styles.container}>
      {files.map((f, i) => (
        <View key={i} style={styles.fileRow}>
          <Text style={styles.fileName} numberOfLines={1}>{f.name}</Text>
          <TouchableOpacity onPress={() => removeFile(i)} style={styles.removeBtn}>
            <Text style={styles.removeText}>✕</Text>
          </TouchableOpacity>
        </View>
      ))}

      <TouchableOpacity style={styles.pickBtn} onPress={pickFiles} activeOpacity={0.7}>
        <Text style={styles.pickIcon}>📎</Text>
        <Text style={styles.pickText}>
          {files.length === 0
            ? `Choose PDF${multiple ? 's' : ''}`
            : multiple ? 'Add another PDF' : 'Replace PDF'}
        </Text>
      </TouchableOpacity>

      <Text style={styles.hint}>
        PDF only · Max {maxSizeMB}MB per file
      </Text>
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 10 },
  fileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0fdf4',
    borderWidth: 1,
    borderColor: '#86efac',
    borderRadius: 10,
    padding: 12,
    gap: 8,
  },
  fileName: { flex: 1, fontSize: 13, color: '#166534' },
  removeBtn: {
    width: 22, height: 22,
    borderRadius: 11,
    backgroundColor: '#fca5a5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeText: { fontSize: 11, color: '#7f1d1d', fontWeight: '700' },
  pickBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1.5,
    borderColor: '#6366f1',
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: 16,
    backgroundColor: '#fafafa',
  },
  pickIcon: { fontSize: 18 },
  pickText: { fontSize: 15, color: '#6366f1', fontWeight: '500' },
  hint: { fontSize: 12, color: '#9ca3af', textAlign: 'center' },
  error: { fontSize: 12, color: '#ef4444' },
});
