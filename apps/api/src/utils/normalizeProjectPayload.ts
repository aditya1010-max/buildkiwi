import type { Request } from "express";

function normalizeUrl(value: unknown): string {
  if (typeof value !== "string") return "";

  const url = value.trim();

  if (!url) return "";

  if (/^https?:\/\//i.test(url)) {
    return url;
  }

  return `https://${url}`;
}

function normalizeTags(value: unknown): unknown {
  if (!value) return [];

  if (Array.isArray(value)) {
    return value;
  }

  if (typeof value === "string") {
    try {
      return JSON.parse(value);
    } catch {
      return [];
    }
  }

  return [];
}

export function normalizeProjectPayload(
  body: Request["body"],
): Record<string, unknown> {
  const data =
    body && typeof body === "object" ? (body as Record<string, unknown>) : {};

  return {
    ...data,
    tags: normalizeTags(data.tags),
    links: {
      github: normalizeUrl(data.github),
      demo: normalizeUrl(data.demo),
    },
  };
}
