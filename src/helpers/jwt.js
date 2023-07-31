import { redirect } from "react-router-dom";
import jwtDecode from "jwt-decode";
import { useSelector } from "react-redux";
import { store } from "../store/store";
import { toggleIsAuth } from "../store/authSlice";

export function getTokenDuration() {
  const storedExpirationDate = localStorage.getItem("expiration");
  const expirationDate = new Date(storedExpirationDate);
  const now = new Date();
  const duration = expirationDate.getTime() - now.getTime();
  // console.log({expirationDate})
  // console.log({now})
  return duration;
}

export function getAuthToken() {
  const token = localStorage.getItem("token");

  if (!token) {
    return 0
  }

  const tokenDuration = getTokenDuration();
  //console.log({tokenDuration})
  if (tokenDuration < 0) {
    return 'EXPIRED';
  }

 // store.dispatch(toggleIsAuth({isAuth: true}));
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
