import { XMLParser } from "fast-xml-parser";
import { Question, Survey, AuthResponse } from "../types/survey";

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "@_",
  textNodeName: "#text",
  parseAttributeValue: false, // keep attribute values as strings
  parseTagValue: true,
  trimValues: true,
  processEntities: true, // handle &amp; &lt; etc
  htmlEntities: true, // handle HTML entities
  isArray: (name) =>
    ["survey", "question", "option", "certificate"].includes(name),
});

// ─── Sanitize text — replace common encoding artifacts ────────────────────────
function cleanText(raw: any): string {
  if (raw === null || raw === undefined) return "";
  const str = String(raw);
  return str
    .replace(/â€"/g, "—") // UTF-8 em dash misread as latin-1
    .replace(/â€˜/g, "\u2018") // left single quote
    .replace(/â€™/g, "\u2019") // right single quote
    .replace(/â€œ/g, "\u201C") // left double quote
    .replace(/â€/g, "\u201D") // right double quote
    .replace(/Â·/g, "·") // middle dot
    .trim();
}

// ─── Parse <auth_response> ────────────────────────────────────────────────────
export function parseAuthResponse(xml: string): AuthResponse {
  const result = parser.parse(xml);
  const a = result?.auth_response ?? {};

  if (!a.token) {
    throw new Error("Invalid auth response — no token found");
  }

  return {
    token: String(a.token),
    type: String(a.type ?? "Bearer"),
    username: String(a.username ?? ""),
    email: String(a.email ?? ""),
    role: String(a.role ?? "USER") as "ADMIN" | "USER",
  };
}

// ─── Parse <surveys> ──────────────────────────────────────────────────────────
export function parseSurveys(xml: string): Survey[] {
  const result = parser.parse(xml);
  const surveys = result?.surveys?.survey ?? [];
  return surveys.map((s: any) => ({
    id: Number(s["@_id"]),
    name: cleanText(s.name),
    description: cleanText(s.description),
  }));
}

// ─── Parse single <survey> ────────────────────────────────────────────────────
export function parseSurvey(xml: string): Survey {
  const result = parser.parse(xml);
  const s = result?.survey ?? {};
  return {
    id: Number(s["@_id"]),
    name: cleanText(s.name),
    description: cleanText(s.description),
  };
}

// ─── Parse a single <option value="X">Label</option> ─────────────────────────
function parseOption(o: any): { value: string; label: string } {
  if (typeof o === "string") {
    return { value: o, label: cleanText(o) };
  }
  const value = String(o["@_value"] ?? "");
  const label = cleanText(o["#text"] ?? o["@_value"] ?? "");
  return { value, label };
}

// ─── Parse <questions> ────────────────────────────────────────────────────────
export function parseQuestions(xml: string): Question[] {
  // Ensure the XML is decoded as UTF-8 before parsing
  const decoded = decodeXmlEntities(xml);
  const result = parser.parse(decoded);
  const questions = result?.questions?.question ?? [];

  return questions.map((q: any) => {
    const options = q.options;
    const fileProp = q.file_properties;

    return {
      id: Number(q["@_id"]),
      name: String(q["@_name"] ?? ""),
      type: String(q["@_type"] ?? "short_text"),
      text: cleanText(q.text),
      description: cleanText(q.description),
      required: q["@_required"] === "yes",
      options: options
        ? {
            multiple: options["@_multiple"] === "yes",
            option: (options.option ?? []).map(parseOption),
          }
        : undefined,
      fileProperties: fileProp
        ? {
            format: String(fileProp["@_format"] ?? ".pdf"),
            maxFileSize: Number(fileProp["@_max_file_size"] ?? 1),
            maxFileSizeUnit: String(fileProp["@_max_file_size_unit"] ?? "mb"),
            multiple: fileProp["@_multiple"] === "yes",
          }
        : undefined,
    };
  });
}

// ─── Decode XML numeric/named entities ───────────────────────────────────────
function decodeXmlEntities(xml: string): string {
  return xml
    .replace(/&#8212;/g, "—") // em dash numeric entity
    .replace(/&#x2014;/g, "—") // em dash hex entity
    .replace(/&mdash;/g, "—") // em dash named entity
    .replace(/&ndash;/g, "–") // en dash
    .replace(/&lsquo;/g, "\u2018")
    .replace(/&rsquo;/g, "\u2019")
    .replace(/&ldquo;/g, "\u201C")
    .replace(/&rdquo;/g, "\u201D");
}

// ─── Build multipart form data for response submission ────────────────────────
export function buildFormData(
  answers: Record<string, string>,
  fileFields: Record<string, any[]>,
): FormData {
  const form = new FormData();

  Object.entries(answers).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      form.append(key, value);
    }
  });

  Object.entries(fileFields).forEach(([key, files]) => {
    files.forEach((file) => {
      form.append(key, {
        uri: file.uri,
        name: file.name,
        type: file.mimeType ?? "application/pdf",
      } as any);
    });
  });

  return form;
}
