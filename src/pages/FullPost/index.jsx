import React from "react";

import { useLoaderData, Await } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "../../axios";
import ReactMarkdown from "react-markdown";

import { CommentsBlock, NewComment, Post } from "../../components";
import { store } from "../../store/store";
import { setComments } from "../../store/commentsSlice";

export const FullPost = () => {
  const { postData } = useLoaderData();
  const { comments } = useSelector((state) => state.comments);
  const { isAuth, user } = useSelector((state) => state.auth);

  const commentsIsLoading = comments.status === "loading";

  return (
    <>
      <React.Suspense fallback={<Post isLoading={true} isFullPost />}>
        <Await resolve={postData}>
          {(loadedPost) => {
            const post = loadedPost.data;

            return (
              <>
                <Post
                  likesCount={post.likesCount}
                  isLiked={post.isLiked}
                  id={post.id}
                  title={post.title}
                  imageUrl={
                    post.imageUrl
                      ? `http://localhost:5000/${post.imageUrl}`
                      : ""
                  }
                  user={{
                    avatarUrl: post?.user?.avatarUrl
                      ? `http://localhost:5000/${post.user.avatarUrl}`
                      : null,
                    fullName: post?.user?.fullName,
                  }}
                  createdAt={new Date(post.createdAt).toDateString()}
                  viewsCount={post.viewsCount}
                  commentsCount={post.commentsCount}
                  tags={post.tags}
                  isFullPost
                >
                  <ReactMarkdown children={post.text} />
                </Post>
              </>
            );
          }}
        </Await>
      </React.Suspense>
      <CommentsBlock
        isLoading={commentsIsLoading}
        items={comments.items}
        lockEdit={false}
      >
        {isAuth && <NewComment user={user} />}
      </CommentsBlock>
    </>
  );
};

async function getFullPostData(id) {
  const token = localStorage.getItem("token");
  const post = await axios.get("posts/" + id, {
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : ''
    },
  });
  const comments = post?.data?.comments ? post.data.comments : [];
  store.dispatch(setComments(comments));
  return post;
}

export function postLoader({ params }) {
  const postData = getFullPostData(params.id);

  return { postData };
}
