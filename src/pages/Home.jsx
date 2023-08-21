import React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Grid from "@mui/material/Grid";

import { Post } from "../components/Post";
import { TagsBlock } from "../components/TagsBlock";
import { CommentsBlock } from "../components/CommentsBlock";
import { useDispatch, useSelector } from "react-redux";
import {  getPosts, getTags } from "../store/postsSlice";
import { getAuthToken } from "../helpers/jwt";
import { getLastComments } from "../store/commentsSlice";

const tabs = ["new", "popular"];

export const Home = () => {
  const { posts, tags } = useSelector((state) => state.posts);
  const { lastComments } = useSelector((state) => state.comments);
  const { isAuth, user } = useSelector((state) => state.auth);
  const { tab } = useSelector((state) => state.posts.posts);
  const selectedTab = tabs.findIndex((element) => element == tab);
  const dispatch = useDispatch();
  
  const lastCommentsIsLoading = lastComments.status === "loading";
  const postsIsLoading = posts.status === "loading";
  const tagsIsLoading = tags.status === "loading";

  React.useEffect(() => {
    dispatch(getPosts({ tag: null, tab }));
  }, []);
  React.useEffect(()=>{
    dispatch(getTags());
    dispatch(getLastComments());
  },[posts.deleteFlag])


  function tabsClickHandler(tag, tab, event) {
    dispatch(getPosts(tag, tab));
  }

  return (
    <>
      <Tabs
        style={{ marginBottom: 15 }}
        value={selectedTab}
        aria-label="basic tabs example"
      >
        <Tab
          label="New"
          onClick={tabsClickHandler.bind(this, { tag: null, tab: "new" })}
        />
        <Tab
          onClick={tabsClickHandler.bind(this, { tag: null, tab: "popular" })}
          label="Popular"
        />
      </Tabs>
      <Grid container spacing={4}>
        <Grid xs={8} item>
          {postsIsLoading &&
            [...Array(5)].map((post, index) => (
              <Post key={index} isLoading={true} />
            ))}
          {!postsIsLoading &&
            posts.items.map((post) => {
              const postIsEditable = (() => {
                if (!isAuth) {
                  return false;
                }
                const token = getAuthToken();
                const { id } = token;
                return post.user.id == id;
              })();
          
              return (
                <Post
                  key={post.id}
                  isLiked={post.isLiked}
                  likesCount={post.likesCount}
                  id={post.id}
                  title={post.title}
                  imageUrl={
                    post.imageUrl
                      ? `http://localhost:5000/${post.imageUrl}`
                      : ""
                  }
                  user={{
                    avatarUrl: post.user.avatarUrl
                      ? `http://localhost:5000/${post.user.avatarUrl}`
                      : "",
                    fullName: post.user.fullName,
                  }}
                  createdAt={new Date(post.createdAt).toDateString()}
                  viewsCount={post.viewsCount}
                  commentsCount={post.commentsCount}
                  tags={post.tags}
                  isEditable={postIsEditable}
                />
              );
            })}
        </Grid>
        <Grid xs={4} item>
          <TagsBlock items={tags.items} isLoading={tagsIsLoading} />
          <CommentsBlock
            items={lastComments.items}
            isLoading={lastCommentsIsLoading}
          />
        </Grid>
      </Grid>
    </>
  );
};
