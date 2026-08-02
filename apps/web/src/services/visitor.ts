const VISITOR_ID_KEY = "buildkiwi-visitor-id";

export function getVisitorId() {
  const visitorId = localStorage.getItem(VISITOR_ID_KEY);

  if (visitorId) {
    return visitorId;
  }

  const newVisitorId = crypto.randomUUID();

  localStorage.setItem(VISITOR_ID_KEY, newVisitorId);

  return newVisitorId;
}
