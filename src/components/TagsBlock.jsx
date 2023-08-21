import React from "react";

import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import TagIcon from "@mui/icons-material/Tag";
import ListItemText from "@mui/material/ListItemText";
import Skeleton from "@mui/material/Skeleton";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { SideBlock } from "./SideBlock";
import { getPosts } from "../store/postsSlice";

export const TagsBlock = ({ items, isLoading = true }) => {
  const { tab } = useSelector((state) => state.posts.posts);
  const { selectedTag } = useSelector((state) => state.posts.tags);

  const dispatch = useDispatch();
  function clickHandler(tag, event) {
    dispatch(getPosts({ tag, tab }));
  }
  return (
    <SideBlock title="Tags">
      <List>
        {(isLoading ? ["a", "b", "c", "d", "e"] : items).map((name, i) => (
          <Link
            onClick={clickHandler.bind(this, name)}
            key={name}
            style={{ textDecoration: "none", color: "black" }}
          >
            <ListItem key={i} disablePadding>
              <ListItemButton selected={selectedTag == name}>
                <ListItemIcon>
                  <TagIcon />
                </ListItemIcon>
                {isLoading ? (
                  <Skeleton width={100} />
                ) : (
                  <ListItemText primary={name} />
                )}
              </ListItemButton>
            </ListItem>
          </Link>
        ))}
      </List>
    </SideBlock>
  );
};
