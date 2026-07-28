import api from "./api";
import { FeedbackRequest } from "../types/feedback";

export async function submitFeedback(data: FeedbackRequest) {
  const response = await api.post("/feedback", data);
  return response.data;
}
