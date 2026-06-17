import client from "./client";
import {
  parseSurveys,
  parseSurvey,
  parseQuestions,
  parseAuthResponse,
} from "./xml";
import {
  Question,
  Survey,
  SurveyAnswers,
  FileAsset,
  AuthResponse,
} from "../types/survey";

// ─── Auth ─────────────────────────────────────────────────────────────────────

export async function login(
  email: string,
  password: string,
): Promise<AuthResponse> {
  const xmlBody = `<login_request>\n  <email>${email}</email>\n  <password>${password}</password>\n</login_request>`;

  const response = await client.post("/api/auth/login", xmlBody, {
    headers: {
      "Content-Type": "application/xml",
      Accept: "application/xml",
    },
    responseType: "text",
  });

  return parseAuthResponse(response.data);
}

// ─── Surveys ──────────────────────────────────────────────────────────────────

export async function fetchSurveys(): Promise<Survey[]> {
  const response = await client.get("/api/surveys", {
    responseType: "text",
  });
  return parseSurveys(response.data);
}

export async function fetchSurvey(id: number): Promise<Survey> {
  const response = await client.get(`/api/surveys/${id}`, {
    responseType: "text",
  });
  return parseSurvey(response.data);
}

// ─── Questions ────────────────────────────────────────────────────────────────

export async function fetchQuestions(surveyId: number): Promise<Question[]> {
  const response = await client.get(`/api/surveys/${surveyId}/questions`, {
    responseType: "text",
  });
  return parseQuestions(response.data);
}

// ─── Submit response ──────────────────────────────────────────────────────────

export async function submitResponse(
  surveyId: number,
  answers: SurveyAnswers,
  questions: Question[],
): Promise<void> {
  const form = new FormData();

  questions.forEach((q) => {
    const val = answers[q.name];
    if (val === undefined || val === null) return;

    if (q.type === "file") {
      // Append each file individually with explicit type
      const files = val as FileAsset[];
      files.forEach((file) => {
        form.append(q.name, {
          uri: file.uri,
          name: file.name,
          type: "application/pdf",
        } as any);
      });
    } else if (q.type === "multiple_choice" && Array.isArray(val)) {
      // Join multiple choice values with comma
      form.append(q.name, (val as string[]).join(","));
    } else {
      form.append(q.name, String(val));
    }
  });

  // Let axios set Content-Type with correct multipart boundary automatically
  // Do NOT set Content-Type manually — it must include the boundary parameter
  await client.post(`/api/surveys/${surveyId}/responses`, form, {
    headers: {
      Accept: "application/xml",
      "Content-Type": "multipart/form-data",
    },
    transformRequest: (data) => data, // prevent axios from transforming FormData
  });
}
