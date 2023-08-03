import React from "react";

import axios from "../../axios";
import "easymde/dist/easymde.min.css";

import {
  redirect,
  useLoaderData,
  defer,
  Await,
  useActionData,
} from "react-router-dom";
import { getAuthToken } from "../../helpers/jwt";
import CreatePostForm from "../../components/CreatePostForm";

export const EditPost = () => {
  const { postData } = useLoaderData();
  const actionData = useActionData();
  const initialState = {
    errors: null,
    id: null,
    isLoading: true,
    title: null,
    tags: null,
    text: null,
    imageUrl: null,
  };
  const [state, setState] = React.useState(initialState);
  const [errors, setErrors] = React.useState();

  React.useEffect(() => {
    if (actionData) {
      setErrors(actionData.message);
    }
  }, [actionData]);

  function applyInitialValues(loadedPost) {
    if (state.isLoading) {
      setState({
        id: loadedPost.data.id,
        isLoading: false,
        title: loadedPost.data.title,
        tags: loadedPost.data.tags,
        text: loadedPost.data.text,
        imageUrl: loadedPost.data.imageUrl,
        errors: null,
      });
    }
  }

  return (
    <>
      {postData && (
        <React.Suspense>
          <Await resolve={postData}>
            {(loadedPost) => applyInitialValues(loadedPost)}
          </Await>
        </React.Suspense>
      )}

      <CreatePostForm
        errors={errors}
        id={state.id}
        isLoading={state.isLoading}
        title={state.title}
        tags={state.tags}
        text={state.text}
        imageUrl={state.imageUrl}
      />
    </>
  );
};

export async function editPostAction({ request }) {
  try {
    const { token, postData, id } = await getFormData(request);

    const response = await axios.patch(`/posts/${id}`, postData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return redirect(`/posts/${id}`);
  } catch (e) {
    return e.response.data;
  }
}

export async function editPostLoader({ params }) {
  const decodedToken = getAuthToken();

  if (!decodedToken) {
    return redirect("/auth/login");
  }

  const postData = getPostData(params.id);

  return defer({ postData });
}

async function getPostData(id) {
  const post = await axios.get("posts/" + id);
  return post;
}

async function getFormData(request) {
  const data = await request.formData();
  const token = data.get("token");
  const id = data.get("id");
  const postData = {
    title: data.get("title"),
    tags: data
      .get("tags")
      .split(",")
      .map((item) => item.trim()),
    text: data.get("text"),
    imageUrl: data.get("image"),
  };
  return { token, postData, id };
}
