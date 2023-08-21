import React from "react";

import { SideBlock } from "./SideBlock";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import Skeleton from "@mui/material/Skeleton";
import { IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Clear";
import EditIcon from "@mui/icons-material/Edit";
import { Link } from "react-router-dom";
import styles from "./Post/Post.module.scss";
import clsx from "clsx";
import { useDispatch } from "react-redux";
import { deleteComment } from "../store/commentsSlice";
import { getAuthToken } from "../helpers/jwt";

export const CommentsBlock = ({
  items,
  children,
  isLoading = true,
  lockEdit = true,
  isFullPost

}) => {
  const dispatch = useDispatch();
  const user = getAuthToken();

  function onClickRemove(id, e) {
    e.preventDefault();
    const confirmed = window.confirm("r u sure?");
    if (confirmed) {
      dispatch(deleteComment(id));
    }
  }

  function onClickEdit() {
    window.alert("The edit feature is under development...");
  }

  return (
    <>
      <SideBlock title="Comments">
        {children}
        <List>
          {(isLoading
            ? [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }]
            : items
          ).map((obj, index) => {
            const isEditable = user?.id == obj?.user?.id;
            const avatarUrl = obj?.user?.avatarUrl
              ? `http://localhost:5000/${obj.user.avatarUrl}`
              : null;
            return (
              <Link
                
                key={obj?.id}
                to={ isFullPost ? '' : `posts/${obj?.postId}`}
                style={{ textDecoration: "none", color: "black" }}
              >
                <React.Fragment key={obj?.id || index}>
                  <div
                    className={clsx(styles.root, { [styles.rootFull]: false })}
                  >
                    <ListItem alignItems="flex-start">
                      <ListItemAvatar>
                        {isLoading ? (
                          <Skeleton variant="circular" width={40} height={40} />
                        ) : (
                          <Avatar alt={obj.user.fullName} src={avatarUrl} />
                        )}
                      </ListItemAvatar>
                      {isLoading ? (
                        <div
                          style={{ display: "flex", flexDirection: "column" }}
                        >
                          <Skeleton variant="text" height={25} width={120} />
                          <Skeleton variant="text" height={18} width={230} />
                        </div>
                      ) : (
                        <ListItemText
                          primary={
                            obj.user.fullName +
                            " | " +
                            new Date(obj?.createdAt).toLocaleString()
                          }
                          secondary={obj.text}
                        />
                      )}

                      {!lockEdit && isEditable && (
                        <div className={styles.editButtons}>
                          <IconButton onClick={onClickEdit} color="primary">
                            <EditIcon />
                          </IconButton>

                          <IconButton
                            onClick={onClickRemove.bind(this, obj?.id)}
                            color="secondary"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </div>
                      )}
                    </ListItem>
                    <Divider variant="inset" component="li" />
                  </div>
                </React.Fragment>
              </Link>
            );
          })}
        </List>
      </SideBlock>
    </>
  );
};
