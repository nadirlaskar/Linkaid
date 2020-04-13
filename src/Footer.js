import React, { useState, useEffect } from "react";
import "./App.css";
import Typography from "@material-ui/core/Typography";
import Links from "./Links";
const Footer = () => {
  return (
    <footer>
      <div class="menu">
        <div class="contributers">
          <Typography variant="caption" align={"center"}>
            Contributors
          </Typography>
          <Links
            links={[
              {
                name: "Nadir",
                href: "https://www.linkedin.com/in/nadirlaskar",
              },
              {
                name: "Joinal",
                href: "https://in.linkedin.com/in/joinalahmed",
              },
              {
                name: "Bishwabikash",
                href: "https://www.linkedin.com/in/dbishwabikash",
              },
              {
                name: "Debolina",
                href: "https://www.linkedin.com/in/debolina-paul-692b2aa9",
              },
            ]}
          />
        </div>
        <div class="datasource">
          <Typography variant="caption">Data Source</Typography>
          <Links
            links={[
              {
                name: "Dataset from kaggle",
                href:
                  "https://www.kaggle.com/allen-institute-for-ai/CORD-19-research-challenge",
              },
              {
                name: "FAQ from WHO",
                href:
                  "https://www.who.int/news-room/q-a-detail/q-a-coronaviruses",
              },
              {
                name: "STATS",
                href: "https://api.covid19india.org/",
              },
            ]}
          />
        </div>
      </div>
      <a href="/privacy.html">Privacy | Terms&amp;Conditions</a>
    </footer>
  );
};

export default Footer;
