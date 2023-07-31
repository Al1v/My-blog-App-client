import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import axios from "../axios";

const initialState = {
  comments: {
    items: [],
    status: "loading",
  },
  lastComments: {
    items: [],
    status: "loading",
  },
};

export const deleteComment = createAsyncThunk(
  "comments/deleteComments",
  async (id) => {
    const token = localStorage.getItem("token");
    const { data } = await axios.delete(`/comments/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
    });
    return { data, id };
  }
);

export const createComment = createAsyncThunk("comments/", async (reqData) => {
  const token = localStorage.getItem("token");
  const { data } = await axios.post(`/comments`, reqData, {
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    },
  });
  return data;
});

export const getComments = createAsyncThunk(
  "comments/getComments",
  async (id) => {
    const { data } = await axios.get(`comments?postId=${id}`);
    return data;
  }
);

export const getLastComments = createAsyncThunk(
  "comments/getLastComments",
  async () => {
    const { data } = await axios.get(`comments/last`);
    return data;
  }
);

const commentsSlice = createSlice({
  name: "comments",
  initialState,
  reducers: {
    setComments(state, action) {
      state.comments.items = action.payload;
      state.comments.status = "loaded";
    },
  },
  extraReducers: {
    [getLastComments.pending]: (state, action) => {
      state.lastComments.items = [];
      state.lastComments.status = "loading";
    },
    [getLastComments.fulfilled]: (state, action) => {
      state.lastComments.items = action.payload;
      state.lastComments.status = "loaded";
    },
    [getLastComments.rejected]: (state, action) => {
      state.lastComments.items = [];
      state.lastComments.status = "error";
    },
    [getComments.pending]: (state, action) => {
      state.comments.items = [];
      state.comments.status = "loading";
    },
    [getComments.fulfilled]: (state, action) => {
      state.comments.items = action.payload;
      state.comments.status = "loaded";
    },
    [getComments.rejected]: (state, action) => {
      state.comments.items = [];
      state.comments.status = "error";
    },
    [createComment.pending]: (state, action) => {
      state.comments.status = "loading";
    },
    [createComment.fulfilled]: (state, action) => {
      const comment = action.payload;
      if (comment?.id) {
        state.comments.items = [comment, ...state.comments.items];
      }
      state.comments.status = "loaded";
    },
    [createComment.rejected]: (state, action) => {
      state.comments.status = "error";
    },
    [deleteComment.pending]: (state, action) => {
      state.comments.status = "loading";
    },
    [deleteComment.fulfilled]: (state, action) => {
      const { data } = action.payload;
      const { id } = action.payload;
      if (data?.success == true) {
        state.comments.items = state.comments.items.filter(
          (item) => item.id != id
        );
      }
      state.comments.status = "loaded";
    },
    [deleteComment.rejected]: (state, action) => {
      state.comments.status = "error";
    },
  },
});

export const { setComments } = commentsSlice.actions;
export const commentsReducer = commentsSlice.reducer;
