/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Link from "@material-ui/core/Link";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles(theme => ({
  root: {
    "& > * + *": {
      marginLeft: theme.spacing(2)
    }
  }
}));

export default function Links({ links }) {
  const classes = useStyles();

  return (
    <Typography className={classes.root}>
      {links.map((link, i) => {
        return (
          <Link
            key={i}
            href={link.href}
            target="_blank"
            variant="body2"
          >
            {link.name}
          </Link>
        );
      })}
    </Typography>
  );
}
