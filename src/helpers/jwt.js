import { redirect } from "react-router-dom";
import jwtDecode from "jwt-decode";

export function getTokenDuration() {
  const storedExpirationDate = localStorage.getItem("expiration");
  const expirationDate = new Date(storedExpirationDate);
  const now = new Date();
  const duration = expirationDate.getTime() - now.getTime();
  return duration;
}

export function getAuthToken() {
  const token = localStorage.getItem("token");

  if (!token) {
    return 0
  }

  const tokenDuration = getTokenDuration();
  if (tokenDuration < 0) {
    return 'EXPIRED';
  }

  return jwtDecode(token);
}

export function checkAuthLoader() {
  const decodedToken = getAuthToken();

  if (!decodedToken ) {
    return redirect("/auth/login");
  }

  return decodedToken;
}

export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("expiration");
  return redirect("/");
}
