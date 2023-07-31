import React from "react";

import axios from "../../axios";
import "easymde/dist/easymde.min.css";

import { redirect } from "react-router-dom";

import CreatePostForm from "../../components/CreatePostForm";

export const AddPost = () => {

  return (
    <>
      <CreatePostForm isLoading={false} />
    </>
  );
};

export async function addPostAction({ request }) {
  try {
    const { token, postData } = await getFormData(request);
    const response = await axios.post(`/posts`, postData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const id = response.data.id;
    return redirect(`/posts/${id}`);
  } catch (e) {
    throw new Error(e);
  }
}

async function getFormData(request) {
  const data = await request.formData();
  const token = data.get("token");
  const postData = {
    title: data.get("title"),
    tags: data
      .get("tags")
      .split(",")
      .map((item) => item.trim()),
    text: data.get("text"),
    imageUrl: data.get("image"),
  };
  return { token, postData };
}
