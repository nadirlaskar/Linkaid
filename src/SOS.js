import React, { useState, useEffect } from "react";
import "./App.css";
import SearchBoxMui from "./SearchBoxMUI";
import HelpList from "./HelpList";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import ButtonBase from "@material-ui/core/ButtonBase";
import Button from "@material-ui/core/Button";
import AddIcon from "@material-ui/icons/AddCircleOutline";
import InfoIcon from "@material-ui/icons/ArrowRight";
import LoginIcon from "@material-ui/icons/PersonRounded";
import CloseIcon from "@material-ui/icons/CloseOutlined";
import Paper from "@material-ui/core/Paper";
import Links from "./Links";
import SelectCategory from "./Select";
import LocationIcon from "@material-ui/icons/GpsFixedOutlined";
import LocationNIcon from "@material-ui/icons/GpsNotFixedOutlined";
import ResponsiveDialog from "./ResponsiveDialog";
import FormControl from "@material-ui/core/FormControl";
import FormHelperText from "@material-ui/core/FormHelperText";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Link from "@material-ui/core/Link";
import config from "./config";
import "./help.css";
import Footer from "./Footer";
import { geolocated } from "react-geolocated";
import MapLocate from "./MapLocate";
import { getAddressFrom } from "./utils";

import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import Header from "./Header";
import { LinearProgress, CircularProgress } from "@material-ui/core";

const fetchAllSOS = (latlng) => {
  return serverCall(
    config.hostname + "/help/sos?latlng=" + latlng,
    false,
    true
  );
};
const getTags = () => {
  return serverCall(config.hostname + "/help/tags?latlng", false, true);
};

const sosModel = {
  name: "",
  address: "",
  contact: "",
  tags: [],
  location: {},
};

function App({
  coords,
  isGeolocationAvailable, // boolean flag indicating that the browser supports the Geolocation API
  isGeolocationEnabled, // boolean flag indicating that the user has allowed the use of the Geolocation API
  positionError, // object with the error returned from the Geolocation API call
}) {
  const [sos, setSOS] = useState([]);
  const [tags, setTags] = useState([]);
  const [mylocation, setMyLocation] = useState(null);
  const [dialog, showDialog] = useState(-1);
  const [alertDialog, setAlert] = useState(false);

  useEffect(() => {
    getTags().then((res) => {
      setTags(res);
    });
  }, [sos]);

  // Fetch new sos list on location change
  useEffect(() => {
    if (mylocation !== null) {
      var sos = [{ ...sosModel, location: mylocation }];
      fetchAllSOS(`${mylocation.latitude},${mylocation.longitude}`)
        .then((res) => {
          sos = sos.concat(res);
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          setSOS(sos);
        });
    }
  }, [mylocation]);

  // Update location on coords changes.
  useEffect(() => {
    if (mylocation == null && coords !== null)
      setMyLocation({
        latitude: coords.latitude,
        longitude: coords.longitude,
        accuracy: coords.accuracy,
      });
  }, [coords]);

  useEffect(() => {
    if (positionError)
      fetch(`https://location.services.mozilla.com/v1/geolocate?key=test`)
        .then((res) => res.json())
        .then((res) => {
          setMyLocation({
            latitude: res.location.lat,
            longitude: res.location.lng,
            accuracy: res.accuracy,
          });
        })
        .catch((err) => {
          setMyLocation({
            latitude: 0,
            longitude: 0,
            accuracy: 200000,
          });
        });
  }, [positionError]);

  // Render
  return (
    <>
    <Header active={"Request Help"} type="normal"/>
      <ResponsiveDialog
        title={
          <>
            <Typography variant="h5" align={"center"}>
              Unable to create SOS!
            </Typography>
            <Typography variant="body1" align={"center"} component={"div"}>
              {`Accuracy should be less than 1km`}
            </Typography>
          </>
        }
        nofullscreen={true}
        body={
          <div
            style={{
              maxWidth: 400,
            }}
          >
            <Typography variant="h5" component="div" align="center">
              {"Zoom into the map for getting higher accuracy."}
            </Typography>
          </div>
        }
        open={alertDialog}
        handleClose={() => {
          setAlert(false);
        }}
      />
      <ResponsiveDialog
        title={
          <div class="form-title">
            <div class="covid-logo center grayscale"></div>
            <Typography variant={"h5"} align={"center"}>
              {`Request Form`}
            </Typography>
            <Typography
              variant={"caption"}
              component={"div"}
              className={"dialog-subtext"}
            >
              {`We will get back to you with help.`}
            </Typography>
          </div>
        }
        body={
          <>
            <EditMarkerData
              tagOptions={tags}
              marker={sos[dialog]}
              onSave={(res) => {
                setSOS([{ ...sosModel, location: sos[0].location }, ...res]);
                showDialog(-1);
              }}
              onClose={() => {
                showDialog(-1);
              }}
            />
          </>
        }
        open={dialog == 0}
        handleClose={() => {
          showDialog(-1);
        }}
      ></ResponsiveDialog>
      {mylocation !== null ? (
        <MapLocate
          page="sos"
          currentLocation={sos.length > 0 ? sos[0].location : mylocation}
          fullscreen={true}
          open={true}
          onMarkerClick={(markerId) => {
            if (sos[markerId].location.accuracy >= 15) {
              showDialog(markerId);
            } else {
              setAlert(true);
            }
          }}
          markerList={sos.map((s, i) => {
            return {
              ...s.location,
              draggable: i == 0,
              icon: {
                url:
                  i == 0
                    ? "/add_location.svg"
                    : s.status == "active"
                    ? "/emoji_people_red.svg"
                    : s.status == "assigned"
                    ? "/emoji_people_orange.svg"
                    : s.status == "resolved"
                    ? "/emoji_people_green.svg"
                    : "/emoji_people_red.svg",
              },
            };
          })}
          locationUpdate={(pos, id) => {
            console.log("update", pos);
            let address = getAddressFrom(pos.resolvedAddress);
            var _sos = [...sos];
            _sos[id].location = {
              ..._sos[id].location,
              longitude: pos.longitude,
              latitude: pos.latitude,
              accuracy: pos.accuracy,
              formattedAddress: pos?.resolvedAddress?.formatted_address,
              addressComponent: address,
            };
            setSOS(_sos);
          }}
          onClose={() => {}}
        />
      ) : (
        <div class="loader">
          <CircularProgress disableShrink />
        </div>
      )}
    </>
  );
}

const EditMarkerData = ({ tagOptions, marker, onClose, onSave }) => {
  const [markerDraft, setMarkerDraft] = useState(marker);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  let { name, contact, comment, tags } = markerDraft;
  return (
    <Paper className="dialog-paper">
      <form class="help-register" noValidate autoComplete="off">
        <FormControl>
          <Autocomplete
            options={tagOptions}
            getOptionLabel={(option) => option}
            value={tags}
            freeSolo={true}
            multiple={true}
            size={"small"}
            filterSelectedOptions={true}
            onChange={(e, newValue) => {
              if (newValue !== null)
                setMarkerDraft({
                  ...markerDraft,
                  tags: newValue.map((x) => x.toLowerCase()),
                });
              setError("");
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label={"Help Category"}
                margin="none"
                helperText={
                  "Used to categorize the help, you can select multiple tags"
                }
              />
            )}
          />
        </FormControl>
        <FormControl>
          <InputLabel htmlFor="component-simple">Name</InputLabel>
          <Input
            id="component-simple"
            value={name}
            onChange={(e) => {
              setMarkerDraft({
                ...markerDraft,
                name: e.target.value,
              });
              setError("");
            }}
          />
        </FormControl>
        <FormControl>
          <InputLabel htmlFor="contact-label">Contact</InputLabel>
          <Input
            id="contact"
            value={contact}
            onChange={(e) => {
              setMarkerDraft({
                ...markerDraft,
                contact: e.target.value,
              });
              setError("");
            }}
            aria-describedby="How to connect with you"
          />
          <FormHelperText id="address-helper-text">
            Example: +910234567890, +911234567897
          </FormHelperText>
        </FormControl>
        <FormControl>
          <InputLabel htmlFor="address-label">Comment</InputLabel>
          <Input
            id="address"
            value={comment}
            onChange={(e) => {
              setMarkerDraft({
                ...markerDraft,
                comment: e.target.value,
              });
              setError("");
            }}
          />
          <FormHelperText id="address-helper-text">
            Something that you want us to know.
          </FormHelperText>
        </FormControl>

        <Typography variant="caption" class="error">
          {error}
        </Typography>
        <div>
          <Button
            variant="contained"
            color="primary"
            size="small"
            disabled={saving}
            startIcon={<AddIcon />}
            onClick={() => {
              setSaving(true);
              serverCall(config.hostname + "/help/sos/add", markerDraft, true)
                .then((res) => {
                  onSave(res);
                })
                .catch((err) => {
                  setError(err);
                })
                .finally(() => setSaving(false));
            }}
          >
            {saving ? "saving..." : "Add Request"}
          </Button>
          <Button
            variant="flat"
            color="primary"
            size="small"
            onClick={onClose}
            startIcon={<CloseIcon />}
          >
            cancel
          </Button>
        </div>
      </form>
    </Paper>
  );
};

const serverCall = (url, data, isJSON = false) => {
  let query = window.location.href.split("?").slice(1);
  if (query.length > 0) {
    let addUrl = url.split("?").slice(1);
    query = query.concat(addUrl);
    query = "?" + query.join("&");
  }
  return new Promise((resolve, reject) => {
    if (data) {
      fetch(url + query, {
        method: "POST",
        headers: {
          "Content-Type": "application/json;charset=utf-8",
        },
        body: JSON.stringify(data),
      }).then((res) => {
        if (res.ok) {
          isJSON ? res.json().then(resolve) : res.text().then(resolve);
        } else {
          res.text().then(reject);
        }
      });
    } else {
      fetch(url + query).then((res) => {
        if (res.ok) {
          res.json().then(resolve);
        } else {
          res.text().then(reject);
        }
      });
    }
  });
};

export default geolocated({
  positionOptions: {
    enableHighAccuracy: true,
    maximumAge: 0,
    timeout: Infinity,
  },
  watchPosition: false,
  userDecisionTimeout: null,
  suppressLocationOnMount: false,
  geolocationProvider: navigator.geolocation,
  isOptimisticGeolocationEnabled: true,
})(App);
