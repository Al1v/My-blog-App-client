import React from "react";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import {
  Form,
  useActionData,
  useNavigation,
  json,
  redirect,
} from "react-router-dom";

import styles from "./Login.module.scss";
import { toggleIsAuth } from "../../store/authSlice";
import { store } from "../../store/store";
import axios from "../../axios";
import jwtDecode from "jwt-decode";

export const Login = () => {
  const data = useActionData();
  const errMsg = data && data.message ? data.message : null;
  const emailErr = errMsg ? errMsg.includes("email") : null;
  const passwordErr = errMsg ? errMsg.includes("password") : null;
  const otherErr = errMsg && !emailErr && !passwordErr ? errMsg : null;

  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  return (
    <Paper classes={{ root: styles.root }}>
      <Form method="POST">
        <Typography classes={{ root: styles.title }} variant="h5">
          Login
        </Typography>

        <TextField
          id="email"
          name="email"
          className={styles.field}
          label="E-Mail"
          error={emailErr}
          helperText={emailErr && errMsg}
          fullWidth
        />
        <TextField
          id="password"
          name="password"
          error={passwordErr}
          helperText={passwordErr && errMsg}
          className={styles.field}
          label="Password"
          fullWidth
        />
        {otherErr}
        <Button
          disabled={isSubmitting}
          type="SUBMIT"
          size="large"
          variant="contained"
          fullWidth
        >
          Login
        </Button>
      </Form>
    </Paper>
  );
};

export async function authAction({ request }) {
  try {
    const mode = request.url.split("/").slice(-1)[0];
    console.log({ mode });
    if (mode !== "login" && mode !== "register") {
      throw json({ message: "Unsupported mode." }, { status: 422 });
    }

    const data = await request.formData();
    const authData = {
      email: data.get("email") ? data.get("email").trim() : "",
      password: data.get("password") ? data.get("password").trim() : "",
    };
    if (mode === "register") {
      authData.fullName = data.get("name") ? data.get("name").trim() : "";
      authData.avatarUrl = data.get("avatarUrl");
      console.log(data.get("avatarUrl"));
    }
    console.log({ authData });

    const response = await axios.post(
      `auth/${mode}`,
      JSON.stringify(authData),
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const resData = await response.data;
    const token = resData.token;
    const user = jwtDecode(token);
    const expiration = new Date();
    expiration.setHours(expiration.getHours() + 1);
    localStorage.setItem("token", token);
    localStorage.setItem("expiration", expiration.toISOString());
    store.dispatch(toggleIsAuth({ isAuth: true, user: user }));
    return redirect("/");
  } catch (e) {
    return e.response.data;
  }
}
