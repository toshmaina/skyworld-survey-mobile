import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { useQuestions, useSurvey } from "@/hooks/useSurveys";
import { submitResponse } from "@/api/surveys";
import { SurveyAnswers, FileAsset, Question } from "@/types/survey";
import QuestionRenderer from "@/components/questions/QuestionRenderer";
import StepProgressBar from "@/components/ui/StepProgressBar";
import LoadingScreen from "@/components/ui/LoadingScreen";
import ErrorScreen from "@/components/ui/ErrorScreen";

type Step = "form" | "review" | "success";

export default function RespondScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const surveyId = Number(id);

  const { survey } = useSurvey(surveyId);
  const { questions, loading, error } = useQuestions(surveyId);

  // ── ALL hooks must be declared before any conditional return ──
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<SurveyAnswers>({});
  const [fieldError, setFieldError] = useState<string | null>(null);
  const [screen, setScreen] = useState<Step>("form");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = useCallback(
    (value: any) => {
      setAnswers((prev) => ({
        ...prev,
        [questions[currentStep]?.name]: value,
      }));
      setFieldError(null);
    },
    [questions, currentStep],
  );

  // ── Conditional returns AFTER all hooks ───────────────────────
  if (loading) return <LoadingScreen message="Loading questions..." />;
  if (error || questions.length === 0)
    return <ErrorScreen message={error ?? "No questions found"} />;

  const question = questions[currentStep];
  const isFirst = currentStep === 0;
  const isLast = currentStep === questions.length - 1;

  // ── Validation ────────────────────────────────────────────────
  const validate = (q: Question, val: any): string | null => {
    if (!q.required) return null;

    if (q.type === "file") {
      return !val || (val as FileAsset[]).length === 0
        ? "Please upload at least one file"
        : null;
    }
    if (q.type === "multiple_choice") {
      return !val || (val as string[]).length === 0
        ? "Please select at least one option"
        : null;
    }
    if (q.type === "email") {
      if (!val || String(val).trim() === "") return "Email is required";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(val)))
        return "Please enter a valid email address";
      return null;
    }
    return !val || String(val).trim() === "" ? "This field is required" : null;
  };

  // ── Navigation ────────────────────────────────────────────────
  const handleNext = () => {
    const val = answers[question.name];
    const err = validate(question, val);
    if (err) {
      setFieldError(err);
      return;
    }
    setFieldError(null);

    if (isLast) {
      setScreen("review");
    } else {
      setCurrentStep((s) => s + 1);
    }
  };

  const handlePrev = () => {
    setFieldError(null);
    setCurrentStep((s) => s - 1);
  };

  const handleEdit = (index: number) => {
    setCurrentStep(index);
    setScreen("form");
  };

  // ── Submission ────────────────────────────────────────────────
  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      await submitResponse(surveyId, answers, questions);
      setScreen("success");
    } catch (e: any) {
      Alert.alert(
        "Submission failed",
        e.response?.data ??
          e.message ??
          "Please check your connection and try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  // ── Success screen ────────────────────────────────────────────
  if (screen === "success") {
    return (
      <>
        <Stack.Screen
          options={{ title: "Submitted!", headerBackVisible: false }}
        />
        <View style={styles.successContainer}>
          <Text style={styles.successIcon}>🎉</Text>
          <Text style={styles.successTitle}>Response submitted!</Text>
          <Text style={styles.successSubtitle}>
            Thank you for completing the survey.
          </Text>
          <TouchableOpacity
            style={styles.doneBtn}
            onPress={() => router.replace("/(app)/surveys")}
          >
            <Text style={styles.doneBtnText}>Back to surveys</Text>
          </TouchableOpacity>
        </View>
      </>
    );
  }

  // ── Review screen ─────────────────────────────────────────────
  if (screen === "review") {
    return (
      <>
        <Stack.Screen options={{ title: "Review your answers" }} />
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.reviewContent}
        >
          <Text style={styles.reviewHeading}>
            Please review before submitting
          </Text>

          {questions.map((q, i) => {
            const val = answers[q.name];
            let display = "";
            if (q.type === "file") {
              display =
                ((val as FileAsset[]) ?? []).map((f) => f.name).join(", ") ||
                "—";
            } else if (Array.isArray(val)) {
              display = (val as string[]).join(", ") || "—";
            } else {
              display = String(val ?? "—");
            }

            return (
              <View key={q.id} style={styles.reviewCard}>
                <View style={styles.reviewCardHeader}>
                  <Text style={styles.reviewQ} numberOfLines={2}>
                    {q.text}
                  </Text>
                  <TouchableOpacity onPress={() => handleEdit(i)}>
                    <Text style={styles.editBtn}>Edit</Text>
                  </TouchableOpacity>
                </View>
                <Text style={styles.reviewA}>{display}</Text>
              </View>
            );
          })}

          <TouchableOpacity
            style={[styles.submitBtn, submitting && styles.btnDisabled]}
            onPress={handleSubmit}
            disabled={submitting}
            activeOpacity={0.8}
          >
            {submitting ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.submitBtnText}>Submit response</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => {
              setScreen("form");
              setCurrentStep(questions.length - 1);
            }}
          >
            <Text style={styles.backBtnText}>← Go back</Text>
          </TouchableOpacity>
        </ScrollView>
      </>
    );
  }

  // ── Stepped form ──────────────────────────────────────────────
  return (
    <>
      <Stack.Screen options={{ title: survey?.name ?? "Survey" }} />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.formContent}
          keyboardShouldPersistTaps="handled"
        >
          <StepProgressBar current={currentStep + 1} total={questions.length} />

          <View style={styles.questionCard}>
            <Text style={styles.questionText}>
              {question.text}
              {question.required && <Text style={styles.required}> *</Text>}
            </Text>
            {question.description ? (
              <Text style={styles.questionDesc}>{question.description}</Text>
            ) : null}

            <View style={styles.inputWrapper}>
              <QuestionRenderer
                question={question}
                value={answers[question.name]}
                onChange={handleChange}
                error={fieldError ?? undefined}
              />
            </View>
          </View>

          <View style={styles.navRow}>
            {!isFirst && (
              <TouchableOpacity style={styles.prevBtn} onPress={handlePrev}>
                <Text style={styles.prevBtnText}>← Previous</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={[styles.nextBtn, isFirst && styles.nextBtnFull]}
              onPress={handleNext}
              activeOpacity={0.8}
            >
              <Text style={styles.nextBtnText}>
                {isLast ? "Review answers →" : "Next →"}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9fafb" },
  formContent: { padding: 16, gap: 16, paddingBottom: 40 },
  reviewContent: { padding: 16, gap: 12, paddingBottom: 40 },

  questionCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    gap: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 3,
  },
  questionText: {
    fontSize: 17,
    fontWeight: "600",
    color: "#111827",
    lineHeight: 24,
  },
  required: { color: "#ef4444" },
  questionDesc: { fontSize: 13, color: "#6b7280" },
  inputWrapper: { marginTop: 4 },

  navRow: { flexDirection: "row", gap: 12 },
  prevBtn: {
    flex: 1,
    padding: 15,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: "#e5e7eb",
    backgroundColor: "#fff",
    alignItems: "center",
  },
  prevBtnText: { fontSize: 15, color: "#374151", fontWeight: "500" },
  nextBtn: {
    flex: 1.5,
    backgroundColor: "#6366f1",
    borderRadius: 14,
    padding: 15,
    alignItems: "center",
  },
  nextBtnFull: { flex: 1 },
  nextBtnText: { color: "#fff", fontSize: 15, fontWeight: "600" },

  reviewHeading: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 4,
  },
  reviewCard: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 16,
    gap: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  reviewCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 8,
  },
  reviewQ: { fontSize: 13, color: "#6b7280", flex: 1 },
  reviewA: { fontSize: 15, color: "#111827", fontWeight: "500" },
  editBtn: { fontSize: 13, color: "#6366f1", fontWeight: "500" },

  submitBtn: {
    backgroundColor: "#6366f1",
    borderRadius: 14,
    padding: 16,
    alignItems: "center",
    marginTop: 8,
  },
  btnDisabled: { opacity: 0.6 },
  submitBtnText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  backBtn: { alignItems: "center", padding: 12 },
  backBtnText: { color: "#6b7280", fontSize: 14 },

  successContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f9fafb",
    padding: 32,
    gap: 16,
  },
  successIcon: { fontSize: 64 },
  successTitle: { fontSize: 24, fontWeight: "700", color: "#111827" },
  successSubtitle: { fontSize: 15, color: "#6b7280", textAlign: "center" },
  doneBtn: {
    marginTop: 8,
    backgroundColor: "#6366f1",
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 14,
  },
  doneBtnText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});
