import { useState, useEffect, useCallback } from 'react';
import { fetchSurveys, fetchSurvey, fetchQuestions } from '../api/surveys';
import { Survey, Question } from '../types/survey';

// ─── Fetch all surveys ────────────────────────────────────────────────────────
export function useSurveys() {
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchSurveys();
      setSurveys(data);
    } catch (e: any) {
      setError(e.message ?? 'Failed to load surveys');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  return { surveys, loading, error, refresh: load };
}

// ─── Fetch single survey ──────────────────────────────────────────────────────
export function useSurvey(id: number) {
  const [survey, setSurvey] = useState<Survey | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = await fetchSurvey(id);
        setSurvey(data);
      } catch (e: any) {
        setError(e.message ?? 'Failed to load survey');
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  return { survey, loading, error };
}

// ─── Fetch questions for a survey ─────────────────────────────────────────────
export function useQuestions(surveyId: number) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = await fetchQuestions(surveyId);
        setQuestions(data);
      } catch (e: any) {
        setError(e.message ?? 'Failed to load questions');
      } finally {
        setLoading(false);
      }
    })();
  }, [surveyId]);

  return { questions, loading, error };
}
