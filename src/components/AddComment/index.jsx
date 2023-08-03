import React from "react";

import styles from "./AddComment.module.scss";

import TextField from "@mui/material/TextField";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import { useDispatch, useSelector } from "react-redux";
import { createComment } from "../../store/commentsSlice";
import { useParams } from "react-router-dom";

export const NewComment = ({ user }) => {
  const dispatch = useDispatch();
  const [value, setValue] = React.useState("");
  const { id } = useParams();
  const commentTextRef = React.useRef();
  const { comments } = useSelector((state) => state.comments);
  const commentsIsLoading = comments.status === "loading";

  function postComment(e) {
    e.preventDefault();
    const reqData = {
      text: commentTextRef.current.value,
      postId: id,
    };

    dispatch(createComment(reqData));
    setValue("");
  }

  return (
    <>
      <div className={styles.root}>
        <Avatar
          classes={{ root: styles.avatar }}
          alt={user.fullName}
          src={`http://localhost:5000/${user.avatarUrl}`}
        />

        <div className={styles.form}>
          <TextField
            label="Write a comment"
            variant="outlined"
            maxRows={10}
            multiline
            fullWidth
            onChange={(event) => setValue(event.target.value)}
            inputRef={commentTextRef}
            value={value}
          />
          <Button onClick={postComment} variant="contained" disabled={commentsIsLoading}>
            Send
          </Button>
        </div>
      </div>
    </>
  );
};
