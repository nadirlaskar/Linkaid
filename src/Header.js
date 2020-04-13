import React, { useState, useEffect } from "react";
import "./App.css";
import SearchBoxMui from "./SearchBoxMUI";
import AnswerList from "./AnswerList";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Links from "./Links";
import LocationIcon from "@material-ui/icons/GpsFixedOutlined";
import LocationNIcon from "@material-ui/icons/GpsNotFixedOutlined";
import InfoIcon from "@material-ui/icons/InfoOutlined";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import FAQ from "./FAQ.js";
import { hostname } from "./config";
import Stats from "./Stats";
import { geolocated } from "react-geolocated";
import Footer from "./Footer";
import MapLocate from "./MapLocate";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import { getAddressFrom } from "./utils";
import { makeStyles } from "@material-ui/core/styles";
import BottomNavigation from "@material-ui/core/BottomNavigation";
import BottomNavigationAction from "@material-ui/core/BottomNavigationAction";
import CommunityIcon from "@material-ui/icons/Group";
import SOSIcon from "@material-ui/icons/EmojiPeople";
import DonationIcon from "@material-ui/icons/Money";
import HelpIcon from "@material-ui/icons/FindInPage";
import { ButtonBase, Fab } from "@material-ui/core";

const useStyles = makeStyles({
  root: {
    width: 500,
    background: "transparent",
  },
});

export default ({ active = "Information", type = "normal" }) => {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);
  let menu = null;
  switch (type) {
    case "admin":
      menu = (null)
      break;
    default:
      menu = (
        <Menu>
          <Item
            active={active}
            label="Information"
            icon={<InfoIcon />}
            onClick={() => {
              window.location.href = `//www.link-aid.org`;
            }}
          />
          <Item
            active={active}
            label="Find Help"
            icon={<HelpIcon />}
            onClick={() => {
              window.location.href = `//help.link-aid.org`;
            }}
          />
          <Item
            active={active}
            label="Request Help"
            icon={<SOSIcon />}
            onClick={() => {
              window.location.href = `//seek.link-aid.org`;
            }}
          />
          <Item
            active={active}
            label="Downloads"
            onClick={() => {
              window.open(`https://drive.google.com/drive/folders/1qgmQbehXGbLUS-Id2kfAxLVNWgi3o2xM?usp=sharing`);
            }}
            icon={<CommunityIcon />}
          />
          <Item
            disabled={true}
            active={active}
            label="Volunteer"
            icon={<CommunityIcon />}
          />
          <Item
            active={active}
            disabled={true}
            label="Donation"
            icon={<DonationIcon />}
          />
        </Menu>
      );
  }
  return (
    <div class="header-wrapper">
      <div class="header">
        <div class="covid-logo" />
        <div class="header-menu">
          {menu}
        </div>
      </div>
    </div>
  );
};

const Menu = ({ children }) => {
  return <ul class="menu">{children}</ul>;
};

const Item = ({ label, icon, onClick, active, disabled }) => {
  return (
    <li
      onClick={onClick}
      class={`${active === label ? "active" : ""}${
        disabled ? " disabled" : ""
      }`}
    >
      {label}
    </li>
  );
};
