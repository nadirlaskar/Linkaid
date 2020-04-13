import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "./AnswerCard";

const useStyles = makeStyles(theme => ({
  root: {
    width: "100%"
  },
  card: {
    marginBottom: 10
  }
}));

function getCards(list, classes) {
  return list.map(({ title, description, action,faqQuestion, isSameQuestion }, i) => {
    return (
      <Card
        question={isSameQuestion?'':faqQuestion}
        title={faqQuestion?isSameQuestion?"":"Related Question":""}
        subtitle={faqQuestion?isSameQuestion?"FAQ":"":""}
        classes={{
          root: classes.card
        }}
        isHTML={true}
        answer={description}
        url={action[0]}
      />
    );
  });
}

export default function CardListPanel({ list }) {
  const classes = useStyles();
  return <div className={classes.root}>{getCards(list, classes)}</div>;
}
