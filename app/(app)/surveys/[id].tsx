import React from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView,
} from 'react-native';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useSurvey, useQuestions } from '@/hooks/useSurveys';
import LoadingScreen from '@/components/ui/LoadingScreen';
import ErrorScreen from '@/components/ui/ErrorScreen';

const TYPE_LABELS: Record<string, string> = {
  short_text: 'Short answer',
  long_text: 'Long answer',
  email: 'Email',
  single_choice: 'Single choice',
  multiple_choice: 'Multiple choice',
  file: 'File upload',
};

export default function SurveyDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const surveyId = Number(id);

  const { survey, loading: sLoading, error: sError } = useSurvey(surveyId);
  const { questions, loading: qLoading } = useQuestions(surveyId);

  if (sLoading || qLoading) return <LoadingScreen message="Loading survey..." />;
  if (sError || !survey) return <ErrorScreen message={sError ?? 'Survey not found'} />;

  return (
    <>
      <Stack.Screen options={{ title: survey.name }} />
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>

        {/* Survey info card */}
        <View style={styles.infoCard}>
          <View style={styles.infoIcon}>
            <Text style={{ fontSize: 28 }}>📋</Text>
          </View>
          <Text style={styles.surveyName}>{survey.name}</Text>
          {survey.description ? (
            <Text style={styles.surveyDesc}>{survey.description}</Text>
          ) : null}
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{questions.length} questions</Text>
          </View>
        </View>

        {/* Questions preview */}
        <Text style={styles.sectionTitle}>Questions</Text>
        <View style={styles.questionsList}>
          {questions.map((q, i) => (
            <View key={q.id} style={styles.questionRow}>
              <View style={styles.questionNum}>
                <Text style={styles.questionNumText}>{i + 1}</Text>
              </View>
              <View style={styles.questionInfo}>
                <Text style={styles.questionText} numberOfLines={2}>{q.text}</Text>
                <View style={styles.questionMeta}>
                  <Text style={styles.questionType}>{TYPE_LABELS[q.type] ?? q.type}</Text>
                  {q.required && (
                    <Text style={styles.requiredBadge}>Required</Text>
                  )}
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Start button */}
        <TouchableOpacity
          style={styles.startBtn}
          activeOpacity={0.8}
          onPress={() => router.push(`/(app)/surveys/${surveyId}/respond`)}
        >
          <Text style={styles.startBtnText}>Start Survey</Text>
          <Text style={styles.startBtnIcon}>→</Text>
        </TouchableOpacity>

      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  content: { padding: 16, gap: 16, paddingBottom: 40 },
  infoCard: {
    backgroundColor: '#1a1a2e',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    gap: 10,
  },
  infoIcon: {
    width: 60, height: 60,
    backgroundColor: '#2d2d4e',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  surveyName: { fontSize: 20, fontWeight: '700', color: '#fff', textAlign: 'center' },
  surveyDesc: { fontSize: 14, color: '#a5b4fc', textAlign: 'center' },
  badge: {
    backgroundColor: '#4338ca',
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 20,
  },
  badgeText: { color: '#e0e7ff', fontSize: 13, fontWeight: '500' },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: '#111827' },
  questionsList: { gap: 10 },
  questionRow: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  questionNum: {
    width: 28, height: 28,
    borderRadius: 14,
    backgroundColor: '#eef2ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  questionNumText: { fontSize: 13, fontWeight: '700', color: '#6366f1' },
  questionInfo: { flex: 1, gap: 5 },
  questionText: { fontSize: 14, color: '#111827', fontWeight: '500' },
  questionMeta: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  questionType: {
    fontSize: 11, color: '#6b7280',
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 8, paddingVertical: 2,
    borderRadius: 6,
  },
  requiredBadge: {
    fontSize: 11, color: '#dc2626',
    backgroundColor: '#fef2f2',
    paddingHorizontal: 8, paddingVertical: 2,
    borderRadius: 6,
  },
  startBtn: {
    backgroundColor: '#6366f1',
    borderRadius: 14,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 8,
  },
  startBtnText: { color: '#fff', fontSize: 17, fontWeight: '600' },
  startBtnIcon: { color: '#c7d2fe', fontSize: 20, fontWeight: '300' },
});
