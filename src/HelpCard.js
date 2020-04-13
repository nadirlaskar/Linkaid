import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import PhoneIcon from "@material-ui/icons/Call";
import NavigationIcon from "@material-ui/icons/Navigation";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles({
  root: {
    minWidth: 275,
    marginBottom: 16,
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
  provider,
  description,
  distance,
  url,
  contactPerson,
  count,
  onClick,
  parentClass,
  active
}) {
  const classes = useStyles();

  return (
    <Card
      elevation={0}
      style={{
        backgroundColor: active ? "#fff" : "#eeeeee8f"
      }}
      className={`${parentClass.root} help-card`}
      onClick={onClick}
    >
      <CardContent style={{
      }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between"
          }}
        >
          <Typography
            className={classes.title}
            color="textSecondary"
            gutterBottom
          >
            {provider}
          </Typography>
          <Typography
            className={classes.title}
            color="textSecondary"
            gutterBottom
          >
            {distance}
          </Typography>
        </div>
        <Typography variant="h5" component="h2">
          {title}
        </Typography>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            margin: "8px 0"
          }}
        >
          <Typography variant="body2" component="p" color="textPrimary">
            {description}
          </Typography>
          <Typography variant="caption" color="textSecondary" align="right">
            Capacity ~ {count} units
          </Typography>
        </div>
      </CardContent>
      <CardActions style={{ justifyContent: "space-between", padding: 16 }}>
        <Button
          variant={"outlined"}
          startIcon={<NavigationIcon />}
          disabled={!Boolean(url)}
          size="small"
          color="primary"
          onClick={() => {
            url && window.open(url);
          }}
        >
          Navigate
        </Button>
        <div>
          {contactPerson.split(",").map(contact => {
            return (
              <Button
                variant="outlined"
                disabled={!Boolean(contact)}
                size="small"
                color="primary"
                startIcon={<PhoneIcon />}
                onClick={() => {
                  window.open("tel:" + contact);
                }}
              >
                {contact ? contact : "Not available"}
              </Button>
            );
          })}
        </div>
      </CardActions>
    </Card>
  );
}
