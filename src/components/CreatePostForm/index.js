import React from "react";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import SimpleMDE from "react-simplemde-editor";
import axios from "../../axios";
import "easymde/dist/easymde.min.css";
import styles from "./CreatePostForm.module.scss";
import { Form } from "react-router-dom";

export default function CreatePostForm(props) {
  const {
    errors: propsErrors,
    id: propsId,
    isLoading: propsIsLoading,
    title: propsTitle,
    tags: propsTags,
    text: propsText,
    imageUrl: propsImageUrl,
  } = props;
  const [imageUrl, setImageUrl] = React.useState();
  const [text, setText] = React.useState();
  const [title, setTitle] = React.useState();
  const [tags, setTags] = React.useState();
  const [titleError, setTitleError] = React.useState();
  const [textError, setTextError] = React.useState();
  const [error, setError] = React.useState();
  const [id, setId] = React.useState(propsId);
  const [isLoading, setIsLoading] = React.useState();
  const fileRef = React.useRef();
  const token = localStorage.getItem("token");

  React.useEffect(() => {
    setTitle(propsTitle);
    setTags(propsTags);
    setText(propsText);
    setId(propsId);
    setImageUrl(propsImageUrl);
    setIsLoading(propsIsLoading);
    setTitleError();
    setTextError();
    setError()

    if (propsErrors) {
      for (let err of propsErrors) {
        if (err.includes("title")) {
          setTitleError(err);
        } else if (err.includes("text")) {
          setTextError(err);
        } else {
          setError(err);
        }
      }
    }
  }, [props]);

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
      setImageUrl(data);
    } catch (error) {
      console.log(error);
    }
  }

  async function onClickRemoveImage() {
    try {
      await axios.delete(`/posts/upload/${imageUrl}`);
      setImageUrl("");
    } catch (e) {
      console.log(e);
    }
  }

  const onChange = React.useCallback((value) => {
    setText(value);
  }, []);

  const options = React.useMemo(
    () => ({
      spellChecker: false,
      maxHeight: "400px",
      autofocus: true,
      placeholder: "post text...",
      status: false,
      uniqueId: "qwerty",
      autosave: {
        enabled: true,
        delay: 1000,
      },
    }),
    []
  );
  return (
    <>
      {error && <p className={styles.error}>{error}</p>}
      <Paper style={{ padding: 30 }}>
        <Form method="PATCH">
          <Button
            onClick={() => fileRef.current.click()}
            variant="outlined"
            size="large"
            disabled={isLoading}
          >
            Load preview
          </Button>
          <input ref={fileRef} type="file" onChange={handleInputFile} hidden />
          {imageUrl && (
            <Button
              variant="contained"
              color="error"
              onClick={onClickRemoveImage}
            >
              Delete
            </Button>
          )}
          {imageUrl && (
            <img
              className={styles.image}
              src={`http://localhost:5000/${imageUrl}`}
              alt="Uploaded"
            />
          )}
          <br />
          <br />
          <TextField
            id="title"
            name="title"
            classes={{ root: styles.title }}
            variant="standard"
            placeholder="Post title..."
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            fullWidth
            disabled={isLoading}
          />
          {titleError && <p className={styles.error}>{titleError}</p>}
          <TextField
            id="tags"
            name="tags"
            classes={{ root: styles.tags }}
            variant="standard"
            placeholder="Tags"
            value={tags}
            onChange={(event) => setTags(event.target.value)}
            fullWidth
            disabled={isLoading}
          />
          <input id="text" name="text" value={text} readOnly hidden />

          <input id="token " name="token" value={token} readOnly hidden />

          <input id="image" name="image" value={imageUrl} readOnly hidden />

          <input id="id" name="id" value={id} readOnly hidden />

          <SimpleMDE
            className={styles.editor}
            value={text}
            onChange={onChange}
            options={options}
          />
          {textError && <p className={styles.error}>{textError}</p>}
          <div className={styles.buttons}>
            <Button
              disabled={isLoading}
              type="submit"
              size="large"
              variant="contained"
            >
              Publish
            </Button>
            <a href="/">
              <Button disabled={isLoading} size="large">
                Cancel
              </Button>
            </a>
          </div>
        </Form>
      </Paper>
    </>
  );
}
