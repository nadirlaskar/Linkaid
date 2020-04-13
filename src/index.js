import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import Home from "./App";
import Help from "./Help";
import Admin from "./Admin";
import SOS from "./SOS";
import * as serviceWorker from "./serviceWorker";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import ReactGA from "react-ga";
import { GA_KEY } from "./config";
ReactGA.initialize(GA_KEY);
ReactGA.pageview(window.location.pathname + window.location.search);

console.log("Running in ", process.env.NODE_ENV);

ReactDOM.render(
  <React.StrictMode>
    <Router>
      {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
      <Switch>
        <Route
          path="/admin"
          render={(props) => {
            const [subdomain] = window.location.hostname.split(".");
            if (
              subdomain === "help" ||
              (process.env.NODE_ENV == "development" ? true : false)
            )
              return <Admin {...props} />;
            else
              return (
                <Home
                  {...props}
                  onError={(err) => {
                    alert(err);
                  }}
                />
              );
          }}
        />
        <Route
          path="/sos"
          render={(props) => {
            const [subdomain] = window.location.hostname.split(".");
            if (
              subdomain === "help" ||
              (process.env.NODE_ENV == "development" ? true : false)
            )
              return <SOS {...props} />;
            else return <Home {...props} />;
          }}
        />
        <Route
          path="/"
          render={(props) => {
            const [subdomain] = window.location.hostname.split(".");
            if (
              subdomain === "help" ||
              (process.env.NODE_ENV == "development" ? true : false)
            )
              return <Help {...props} />;
            else if (subdomain === "seek") return <SOS {...props} />;
            else return <Home {...props} />;
          }}
        />
      </Switch>
    </Router>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
