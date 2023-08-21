import React from "react";
import Button from "@mui/material/Button";
import styles from "./Header.module.scss";
import Container from "@mui/material/Container";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { stateLogout } from "../../hooks/authHook";
import { getPosts } from "../../store/postsSlice";

export const Header = () => {
  const { isAuth } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const onLogout = () => stateLogout();
  return (
    <div className={styles.root}>
      <Container maxWidth="lg">
        <div className={styles.inner}>
          <Link
            className={styles.logo}
            onClick={() => dispatch(getPosts({ tag: null, tab: "new" }))}
          >
            <div>MY BLOG</div>
          </Link>
          <div className={styles.buttons}>
            {isAuth ? (
              <>
                <Link to="/posts/create">
                  <Button variant="contained">Create post</Button>
                </Link>
                <Button onClick={onLogout} variant="contained" color="error">
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link to="/auth/login">
                  <Button variant="outlined">Login</Button>
                </Link>
                <Link to="/auth/register">
                  <Button variant="contained">Register</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
};
