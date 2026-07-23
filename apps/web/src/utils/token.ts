export function getAccessToken() {
  return localStorage.getItem("token");
}

export function setAccessToken(token: string) {
  localStorage.setItem("token", token);
}

export function clearAccessToken() {
  localStorage.removeItem("token");
}
