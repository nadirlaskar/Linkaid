import React from "react";
import Dialog from "@material-ui/core/Dialog";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme, makeStyles } from "@material-ui/core/styles";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
const useStyles = makeStyles({
  paperScrollPaper: {
    maxHeight: "calc(100%)"
  }
});
export default function ResponsiveDialog({
  children,
  open,
  handleClose,
  title,
  body,
  action,
  forceFullscreen=false,
  nofullscreen=false
}) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const classes = useStyles();
  return (
    <div>
      <Dialog
        classes={classes}
        fullScreen={!nofullscreen&&(fullScreen||forceFullscreen)}
        open={open}
        onClose={handleClose}
        maxWidth={"lg"}
        scroll={"body"}
      >
        <DialogTitle id="form-dialog-title">{title}</DialogTitle>
        <DialogContent>{body}</DialogContent>
        <DialogActions>{action}</DialogActions>
      </Dialog>
    </div>
  );
}
