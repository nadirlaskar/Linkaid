import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

const useStyles = makeStyles(theme => ({
  root: {
    width: "100%"
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular
  }
}));

function getPanels(list, classes) {
  return list.map(({ title, description },i) => {
    return (
      <ExpansionPanel key={i}>
        <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography variant="subtitle1" className={classes.heading}>{title}</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <Typography variant="body2">{description}</Typography>
        </ExpansionPanelDetails>
      </ExpansionPanel>
    );
  });
}

export default function SimpleExpansionPanel({ list }) {
  const classes = useStyles();
  return <div className={classes.root}>{getPanels(list,classes)}</div>;
}
