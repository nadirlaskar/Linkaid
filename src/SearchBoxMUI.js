import React, { useRef } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import InputBase from "@material-ui/core/InputBase";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import SearchIcon from "@material-ui/icons/Search";
import QuestionAnswer from "@material-ui/icons/QuestionAnswer";
import VoiceIcon from "@material-ui/icons/Mic";

const useStyles = makeStyles(theme => ({
  root: {
    padding: "2px 4px",
    display: "flex",
    alignItems: "center",
    maxWidth: 600,
    margin: "auto"
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1
  },
  iconButton: {
    padding: 10,
  },
  divider: {
    height: 28,
    margin: 4
  }
}));

export default function CustomizedInputBase({ searchThis, onFocus }) {
  const classes = useStyles();
  const searchRef = useRef(null);
  return (
    <Paper component="form" className={classes.root}>
      <IconButton className={classes.iconButton} aria-label="menu">
        <QuestionAnswer />
      </IconButton>
      <InputBase
        inputRef={searchRef}
        autoFocus={true}
        className={classes.input}
        onKeyPress={e => {
          if (e.key === "Enter") {
            console.log("Enter key pressed");
            e.preventDefault();
            searchThis(searchRef.current.value);
          }
        }}
        placeholder="Ask about corona"
        inputProps={{ "aria-label": "Ask about corona" }}
      />
      <IconButton
        onClick={() => {
          searchThis(searchRef.current.value);
        }}
        color="primary"
        className={classes.iconButton}
        aria-label="search"
      >
        <SearchIcon />
      </IconButton>
    </Paper>
  );
}
