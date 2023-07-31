import React from "react";
import clsx from "clsx";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Clear";
import EditIcon from "@mui/icons-material/Edit";
import EyeIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import CommentIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import { useDispatch } from "react-redux";
import styles from "./Post.module.scss";
import { UserInfo } from "../UserInfo";
import { PostSkeleton } from "./Skeleton";
import { Link } from "react-router-dom";
import { deletePost, getTags, setLike } from "../../store/postsSlice";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

export function Post({
  id,
  title,
  createdAt,
  imageUrl,
  user,
  viewsCount,
  commentsCount,
  tags,
  children,
  isFullPost,
  isLoading,
  isEditable,
  isLiked,
  likesCount,
}) {
  const dispatch = useDispatch();
  const [likeState, setLikeState] = React.useState(isLiked);
  const [likesNumber, setLikesNumber] = React.useState(likesCount);

  if (isLoading) {
    return <PostSkeleton />;
  }

  async function onClickRemove() {
    const confirmed = window.confirm("r u sure?");
    if (confirmed) {
      dispatch(deletePost(id));
    }
  }

  async function likeClickHandler() {
    const { payload } = await dispatch(setLike(id));
    if (payload && payload.liked === true) {
      setLikeState(true);
      setLikesNumber((current) => current + 1);
    } else if (payload && payload.liked === false) {
      setLikeState(false);
      setLikesNumber((current) => current - 1);
    }
  }

  return (
    <div className={clsx(styles.root, { [styles.rootFull]: isFullPost })}>
      {isEditable && (
        <div className={styles.editButtons}>
          <Link to={`/posts/${id}/edit`}>
            <IconButton color="primary">
              <EditIcon />
            </IconButton>
          </Link>
          <IconButton onClick={onClickRemove} color="secondary">
            <DeleteIcon />
          </IconButton>
        </div>
      )}
      {imageUrl && (
        <img
          className={clsx(styles.image, { [styles.imageFull]: isFullPost })}
          src={imageUrl}
          alt={title}
        />
      )}
      <div className={styles.wrapper}>
        <UserInfo {...user} additionalText={createdAt} />
        <div className={styles.indention}>
          <h2
            className={clsx(styles.title, { [styles.titleFull]: isFullPost })}
          >
            {isFullPost ? title : <Link to={`/posts/${id}`}>{title}</Link>}
          </h2>
          <ul className={styles.tags}>
            {tags.map((name) => (
              <li key={name}>
                <Link to={`/tag/${name}`}>#{name}</Link>
              </li>
            ))}
          </ul>
          {children && <div className={styles.content}>{children}</div>}
          <ul className={styles.postDetails}>
            <li>
              <EyeIcon />
              <span>{viewsCount}</span>
            </li>
            <li>
              <CommentIcon />
              <span>{commentsCount}</span>
            </li>
            <li>
              {likeState && (
                <IconButton color="primary">
                  <FavoriteIcon onClick={likeClickHandler} />
                </IconButton>
              )}
              {!likeState && (
                <IconButton color="primary">
                  <FavoriteBorderIcon onClick={likeClickHandler} />
                </IconButton>
              )}
              <span>{likesNumber}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
