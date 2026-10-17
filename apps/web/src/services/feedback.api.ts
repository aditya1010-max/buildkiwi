import type { FeedbackRequest } from "@buildkiwi/validation";
import api from "../services/api";

export async function submitFeedback(data: FeedbackRequest) {
  const response = await api.post("/feedback", data);
  return response.data;
}
