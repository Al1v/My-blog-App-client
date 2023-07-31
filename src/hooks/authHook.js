import React from "react";
import { getAuthToken, getTokenDuration, logout } from "../helpers/jwt";
import { useSelector, useDispatch } from "react-redux";
import { toggleIsAuth, getState } from "../store/authSlice";
import { store } from "../store/store";

export default function UseAuthControl() {
  const dispatch = useDispatch();
  const isAuth = useSelector((state) => state.auth.isAuth);
  let token = getAuthToken();
  React.useEffect(() => {
    if (token === "EXPIRED") {
      stateLogout();
      return;
    }
    if (!token) {
      dispatch(toggleIsAuth({ isAuth: false, user: {} }));
    }
    const tokenDuration = getTokenDuration();

    setTimeout(() => {
      stateLogout();
    }, tokenDuration);
  }, [isAuth]);

  return { isAuth: true, token };
}

export function stateLogout() {
  logout();
  store.dispatch(toggleIsAuth({ isAuth: false, user: {} }));
}

export function authControl() {
  const token = getAuthToken();

  if (!token || token === "EXPIRED") {
    return null;
  }

  store.dispatch(toggleIsAuth({ isAuth: true, user: token }));

  setTimeout(() => {
    stateLogout();
  }, getTokenDuration());

  return null;
}
