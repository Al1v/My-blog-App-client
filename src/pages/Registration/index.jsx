import React from "react";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import { Form, useActionData, useNavigation } from "react-router-dom";
import axios from "../../axios";
import styles from "./Login.module.scss";

export const Registration = () => {
  const [avatarUrl, setAvatarUrl] = React.useState();
  const [nameError, setnameError] = React.useState();
  const [emailError, setEmailError] = React.useState();
  const [passwordError, SetPasswordError] = React.useState();
  const [error, setError] = React.useState();
  const fileRef = React.useRef();
  const data = useActionData();
  const errMsg = data && data.message ? data.message : null;

  React.useEffect(() => {
    setEmailError();
    SetPasswordError();
    setnameError();

    if (errMsg) {
      for (let err of errMsg) {
        if (err.includes("email")) {
          setEmailError(err);
        } else if (err.includes("password")) {
          SetPasswordError(err);
        } else if (err.includes("fullName")) {
          setnameError(err);
        } else {
          setError(err);
        }
      }
    }
  }, [errMsg]);

  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  async function handleInputFile(event) {
    try {
      const formData = new FormData();
      const file = event.target.files[0];
      formData.append("file", file);
      const { data } = await axios.post("/posts/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setAvatarUrl(data);
    } catch (error) {
      console.log(error);
    }
  }

  async function onClickRemoveImage() {
    try {
      await axios.delete(`/posts/upload/${avatarUrl}`);
      setAvatarUrl("");
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <Paper classes={{ root: styles.root }}>
      <Form method="POST">
        <Typography classes={{ root: styles.title }} variant="h5">
          Create account
          {data && data.errors && (
            <ul>
              {Object.values(data.errors).map((err) => (
                <li key={err}>{err}</li>
              ))}
            </ul>
          )}
        </Typography>

        <div className={styles.avatar}>
          <Avatar
            src={`http://localhost:5000/${avatarUrl}`}
            sx={{ width: 150, height: 150 }}
          />
        </div>
        <div className={styles.buttons}>
          <Button
            onClick={() => fileRef.current.click()}
            variant="outlined"
            size="large"
          >
            Load preview
          </Button>
          <input ref={fileRef} type="file" onChange={handleInputFile} hidden />
          {avatarUrl && (
            <Button
              variant="contained"
              color="error"
              onClick={onClickRemoveImage}
            >
              Delete
            </Button>
          )}
        </div>
        <br />

        <input id="avatarUrl" name="avatarUrl" value={avatarUrl} hidden />
        <br />
        <TextField
          className={styles.field}
          label="Full name"
          id="name"
          name="name"
          error={nameError}
          helperText={nameError}
          fullWidth
        />
        <TextField
          className={styles.field}
          id="email"
          name="email"
          label="E-Mail"
          error={emailError}
          helperText={emailError}
          fullWidth
        />
        <TextField
          className={styles.field}
          label="Password"
          fullWidth
          id="password"
          name="password"
          error={passwordError}
          helperText={passwordError}
        />
        <Button
          disabled={isSubmitting}
          type="SUBMIT"
          size="large"
          variant="contained"
          fullWidth
        >
          Sign up
        </Button>
      </Form>
    </Paper>
  );
};
