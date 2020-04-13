import React, { useState, useEffect } from "react";
import FaqList from "./ExpansionList";
import Typography from "@material-ui/core/Typography";
import { hostname } from "./config";
import { NovelCovid } from "novelcovid";
import { Paper } from "@material-ui/core";
import Selection from "./LocationSelector";
const fixDate = time => {
  return time == "0" ? "" : `last updated  ${time}`;
  const hour = new Date(time).getHours();
  const minutes = new Date(time).getMinutes();
  return `${hour < 10 ? "0" : ""}${hour}:${minutes < 10 ? "0" : ""}${minutes}`;
};
const getData = (type = "data") => {
  return fetch(`${hostname}/stats?type=${type}`)
    .then(res => res.json())
    .then(res => {
      var res = type == "data" ? res.statewise : res;
      return res;
    });
};
export default ({ initialFilter }) => {
  const [stats, setStats] = useState(null);
  const [allStats, setAllStats] = useState(null);
  const [filterValues, setFilterValues] = useState([]);
  useEffect(() => {
    getData().then(res => {
      setAllStats(res);
      res[0].lastupdatedtime = fixDate(res[0].lastupdatedtime);
      setStats(res[0]);
    });
  }, []);
  useEffect(() => {
    var filter = Object.values(initialFilter)
      .filter(x => x !== undefined)
      .map(x => x.long_name).slice(0,2);
    setFilterValues(filter);
  }, [initialFilter]);
  console.log("initial filter", initialFilter,filterValues);
  return stats !== null ? (
    <div elevation={0}>
      <div class="stats-header">
        <Selection
          initialFilter={filterValues}
          filters={[
            { label: "State", key: "." },
            { label: "District", key: "districtData" }
          ]}
          onClear={() => {
            setStats(allStats[0]);
          }}
          onSelect={res => {
            var stat = {};
            for (var key in stats) {
              stat[key] = res[key] ? res[key] : 0;
            }
            stat.lastupdatedtime = stats.lastupdatedtime;
            setStats(stat);
          }}
          fetchData={() => {
            return getData("state_district_wise").then(res => {
              for (var state in res) {
                var data = allStats.find(x => x.state == state);
                res[state] = { ...res[state], ...data };
              }
              return res;
            });
          }}
        />
        <Typography
          style={{ lineHeight: 1.5, fontSize: 9, color: "green" }}
          variant={"overline"}
          component="pre"
          align="right"
        >
          {`${stats.lastupdatedtime}`}
        </Typography>
      </div>
      <div class="stats">
        <div class="group critical">
          <Typography
            className="subtext"
            variant={"overline"}
            component="div"
            align="center"
          >
            {`+${stats.deltaconfirmed}`}
          </Typography>
          <Typography className="main" variant={"h6"} align="center">
            {stats.confirmed}
          </Typography>
          <Typography
            className="title"
            color="textSecondary"
            variant={"overline"}
            component="div"
            align="center"
          >
            Confirmed
          </Typography>
        </div>
        <div class="group active">
          <Typography
            className="subtext"
            variant={"overline"}
            component="div"
            align="center"
          >
            {stats.deltaactive ? stats.deltaactive : <span>&nbsp;</span>}
          </Typography>
          <Typography className="main" variant={"h6"} align="center">
            {stats.active}
          </Typography>
          <Typography
            className="title"
            color="textSecondary"
            variant={"overline"}
            component="div"
            align="center"
          >
            Active
          </Typography>
        </div>
        <div class="group recovered">
          <Typography
            className="subtext"
            variant={"overline"}
            component="div"
            align="center"
          >
            {`+${stats.deltarecovered}`}
          </Typography>
          <Typography className="main" variant={"h6"} align="center">
            {stats.recovered}
          </Typography>
          <Typography
            className="title"
            color="textSecondary"
            variant={"overline"}
            component="div"
            align="center"
          >
            Recovered
          </Typography>
        </div>
        <div class="group death">
          <Typography
            className="subtext"
            variant={"overline"}
            component="div"
            align="center"
          >
            {`+${stats.deltarecovered}`}
          </Typography>
          <Typography className="main" variant={"h6"} align="center">
            {stats.deaths}
          </Typography>
          <Typography
            className="title"
            color="textSecondary"
            variant={"overline"}
            component="div"
            align="center"
          >
            Death
          </Typography>
        </div>
      </div>
    </div>
  ) : (
    <Typography variant="caption" component="div" gutterBottom align="center">
      fetching stats...
    </Typography>
  );
};
