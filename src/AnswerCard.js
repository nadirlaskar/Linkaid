import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles({
  root: {
    minWidth: 275,
    marginBottom: 16
  },
  bullet: {
    display: "inline-block",
    margin: "0 2px",
    transform: "scale(0.8)"
  },
  title: {
    fontSize: 14
  },
  pos: {
    marginBottom: 12
  }
});

export default function OutlinedCard({
  title,
  subtitle,
  question,
  answer,
  url,
  isHTML
}) {
  const classes = useStyles();

  return (
    <Card
      classes={{
        ...classes
      }}
    >
      <CardContent>
        <Typography
          className={classes.title}
          color="textSecondary"
          gutterBottom
        >
          {title}
        </Typography>
        <Typography variant="h5" component="h2">
          {question}
        </Typography>
        <Typography className={classes.pos} color="textSecondary">
          {subtitle}
        </Typography>
        <Typography variant="body2" component="p">
          {
            isHTML?<div dangerouslySetInnerHTML={{__html:answer}}></div>:answer
          }
        </Typography>
      </CardContent>
      <CardActions>
        <Button
          disabled={!Boolean(url)}
          size="small"
          color="primary"
          onClick={() => {
            url && window.open(url);
          }}
        >
          Learn More
        </Button>
      </CardActions>
    </Card>
  );
}
