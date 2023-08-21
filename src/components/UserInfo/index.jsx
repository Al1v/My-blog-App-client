import { Avatar, ListItemAvatar} from "@mui/material";
import React from "react";
import styles from "./UserInfo.module.scss";

export const UserInfo = ({ avatarUrl = null, fullName, additionalText }) => {

  return (
    <div className={styles.root}>
      <ListItemAvatar>
        <Avatar alt={fullName} src={avatarUrl} />
      </ListItemAvatar>
      
      <div className={styles.userDetails}>
        <span className={styles.userName}>{fullName}</span>
        <span className={styles.additional}>{additionalText}</span>
      </div>
    </div>
  );
};
