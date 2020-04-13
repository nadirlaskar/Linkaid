import React from "react";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import SwipeableDrawer from "@material-ui/core/SwipeableDrawer";
import Button from "@material-ui/core/Button";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import InboxIcon from "@material-ui/icons/MoveToInbox";
import MailIcon from "@material-ui/icons/Mail";
import { Drawer } from "@material-ui/core";

export default function SwipeableTemporaryDrawer({
  anchor,
  children,
  open,
  onClose,
}) {
  const iOS = process.browser && /iPad|iPhone|iPod/.test(navigator.userAgent);
  return (
    <div>
      <React.Fragment key={anchor}>
        <Drawer
          variant="temporary"
          anchor={anchor}
          open={open}
          onClose={onClose}
          disableBackdropTransition={!iOS}
          disableDiscovery={iOS}
        >
          {children}
        </Drawer>
      </React.Fragment>
    </div>
  );
}
