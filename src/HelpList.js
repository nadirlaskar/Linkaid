import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "./HelpCard";
import { Typography } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  card: {
    marginBottom: 20,
  },
  admin: {
    marginBottom: 20,
    cursor: "pointer",
  },
}));

function getCards(list, classes, type, onEdit) {
  return list.length > 0 ? (
    list.map(
      (
        {
          title,
          provider,
          description,
          distance,
          navigation,
          contactPerson,
          count,
          active,
        },
        i
      ) => {
        return (
          <Card
            key={i}
            active={active}
            itemKey={i}
            parentClass={{
              root: type == "admin" ? classes.admin : classes.card,
            }}
            title={title}
            provider={provider}
            description={description}
            distance={distance?`${(distance/1000).toFixed(1)} km`:`-- km`}
            url={navigation}
            contactPerson={contactPerson}
            count={count}
            onClick={() => {
              console.log("editing.." + i);
              return type == "admin" ? onEdit(i + 1) : null;
            }}
          />
        );
      }
    )
  ) : (
    <div class="info-section">
      <Typography
        variant="caption"
        component={"div"}
        align={"center"}
        style={{ color: "#555" }}
      >
        {type == "admin"
          ? "You have not added any items here"
          : "If you can provide help, please register above."}
      </Typography>
      <Typography
        variant="body2"
        align={"center"}
        color={"textSecondary"}
        gutterBottom
      >
        {type == "admin"
          ? "Please select correct help category".toUpperCase()
          : "No providers yet, we are trying to get providers near you."}
      </Typography>
    </div>
  );
}

export default function CardListPanel({ list, type, onEdit }) {
  const classes = useStyles();
  return (
    <div className={classes.root}>{getCards(list, classes, type, onEdit)}</div>
  );
}
