import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../axios";

const initialState = {
  posts: {
    items: [],
    status: "loading",
    tab: "new",
    deleteFlag: null,
  },
  post: {
    likes: 0,
    isLiked: false,
  },
  tags: {
    items: [],
    status: "loading",
    selectedTag: null,
  },
};

export const deletePost = createAsyncThunk("posts/deletePosts", async (id) => {
  const token = localStorage.getItem("token");
  const { data } = await axios.delete(`/posts/${id}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : ''
    },
  });
  return { data, id };
});

export const getPosts = createAsyncThunk(
  "posts/getPosts",
  async ({ tag, tab }) => {
    const token = localStorage.getItem("token");
    const searchTab = `?tab=${tab}`;
    const searchTag = tag ? `&tag=${tag}` : "";
    const query = searchTab + searchTag;
    const { data } = await axios.get(`/posts${query}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : ''
      },
    });
    return {
      data,
      tag: tag ? tag : null,
      tab: tab ? tab : "new",
    };
  }
);

export const getTags = createAsyncThunk("posts/getTags", async () => {
  const { data } = await axios.get("/tags");
  return data;
});

export const setLike = createAsyncThunk("posts/setLike", async (postId) => {
  const token = localStorage.getItem("token");
  const { data } = await axios.post(
    `/likes/${postId}`,
    {},
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : ''
      },
    }
  );
  return data;
});

const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {},
  extraReducers: {
    [getPosts.pending]: (state, action) => {
      state.posts.items = [];
      state.posts.status = "loading";
    },
    [getPosts.fulfilled]: (state, action) => {
      state.posts.items = action.payload.data;
      state.tags.selectedTag = action.payload.tag;
      state.posts.tab = action.payload.tab;
      state.posts.status = "loaded";
    },
    [getPosts.rejected]: (state, action) => {
      state.posts.items = [];
      state.posts.status = "error";
    },
    [deletePost.pending]: (state, action) => {
      state.posts.status = "loading";
    },
    [deletePost.fulfilled]: (state, action) => {
      const { data } = action.payload;
      const { id } = action.payload;
      if (data?.success == true) {
        state.posts.items = state.posts.items.filter((item) => item.id != id);
      }
      state.posts.deleteFlag = Math.random();
      state.posts.status = "loaded";
    },
    [deletePost.rejected]: (state, action) => {
      state.posts.status = "error";
    },
    [getTags.pending]: (state, action) => {
      state.tags.items = [];
      state.tags.status = "loading";
    },
    [getTags.fulfilled]: (state, action) => {
      state.tags.items = action.payload;
      state.tags.status = "loaded";
    },
    [getTags.rejected]: (state, action) => {
      state.tags.items = [];
      state.tags.status = "error";
    },
  },
});

export const postsReducer = postsSlice.reducer;
