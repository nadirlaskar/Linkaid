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
import LocationIcon from "@material-ui/icons/PinDrop";
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
import Header from "./Header";

const fetchAllHelp = (latlng) => {
  return serverCall(config.hostname + "/help?latlng=" + latlng, false, true);
};

const getGroups = (data) => {
  return data
    ? Array.from(
        new Set(
          Object.values(data)
            .filter((x) => x.group)
            .map((x) => x.group)
            .flat(2)
        )
      )
    : [];
};

function App({
  coords,
  isGeolocationAvailable, // boolean flag indicating that the browser supports the Geolocation API
  isGeolocationEnabled, // boolean flag indicating that the user has allowed the use of the Geolocation API
  positionError, // object with the error returned from the Geolocation API call
}) {
  const [category, selectCategory] = useState("Food");
  const [groups, setGroups] = useState([]);
  const [group, selectGroup] = useState([]);
  const [helpList, setHelpList] = useState([]);
  const [providers, setProviders] = useState({});
  const [providerRegisterDialog, openProviderRegisterDialog] = useState(false);
  const [providerLoginDialog, openProviderLoginDialog] = useState(false);
  const [openMap, setOpenMap] = useState(false);
  const [mylocation, setMyLocation] = useState(null);

  // Fetch new help list on location change
  useEffect(() => {
    if (mylocation !== null)
      fetchAllHelp(`${mylocation.latitude},${mylocation.longitude}`)
        .then((res) => {
          var groups = [];
          for (let provider in res) {
            let list = res[provider][category.toLowerCase()];
            groups = groups.concat(getGroups(list));
          }
          setGroups(groups);
          setProviders(res);
        })
        .catch((err) => {
          console.log(err);
        });
  }, [mylocation]);

  const [handledMapsError, setHandledMapsError] = useState(false);
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
        })
        .finally(() => {
          setHandledMapsError(true);
        });
  }, [positionError]);

  // Get groups when category change
  useEffect(() => {
    let groups = [];
    for (let provider in providers) {
      let list = providers[provider][category.toLowerCase()];
      groups = groups.concat(getGroups(list));
    }
    setGroups(groups);
  }, [category]);

  // Filter list on group change
  useEffect(() => {
    var helpList = [];
    for (let provider in providers) {
      let list = providers[provider][category.toLowerCase()];
      helpList = helpList.concat(
        list
          .filter((x) => x.active)
          .filter((x) =>
            group == null ? true : group.filter((g) => x.group.includes(g))
          )
          .map((item) => {
            return {
              title: item.address,
              provider,
              description: item.comment,
              count: item.capacity,
              contactPerson: item.contactPerson,
              distance: item.distance,
              active: true,
              navigation: item.location
                ? `https://www.google.com/maps/dir/?api=1&destination=${item.location.latitude},${item.location.longitude}`
                : null,
            };
          })
      );
    }
    setHelpList(
      helpList.sort((a, b) => {
        if (a.distance && b.distance) {
          return a.distance - b.distance;
        } else {
          return 0;
        }
      })
    );
  }, [providers, group, category]);

  // Update location on coords changes.
  useEffect(() => {
    if (mylocation == null && coords !== null)
      setMyLocation({
        latitude: coords.latitude,
        longitude: coords.longitude,
        accuracy: coords.accuracy,
      });
  }, [coords]);

  // Render
  return (
    <>
      <div class="help-wrapper">
        <Header active={"Find Help"} type="normal"/>
        <div class="header-location">
          <Button
            disabled={!mylocation}
            size="small"
            color="primary"
            gutterBottom
            onClick={() => setOpenMap(true)}
            startIcon={<LocationIcon />}
          >
            {mylocation ? `Update Location` : "Locating..."}
          </Button>
          <Typography variant="caption" component="div" className="location">
            {mylocation?.addressComponent
              ? `${
                  mylocation.addressComponent.formattedAddress
                    ? mylocation.addressComponent.formattedAddress
                    : "No address found"
                }`
              : ""}
          </Typography>
        </div>
        {mylocation !== null && (
          <MapLocate
            page="help"
            currentLocation={mylocation}
            open={openMap}
            onEncodedLocation={(resolvedAddress) => {
              let address = getAddressFrom(resolvedAddress);
              selectGroup([]);
              setMyLocation({
                ...mylocation,
                addressComponent: address,
              });
            }}
            locationUpdate={(pos) => {
              console.log("update", pos);
              let address = getAddressFrom(pos.resolvedAddress);
              selectGroup([]);
              setMyLocation({
                ...mylocation,
                ...pos,
                addressComponent: address,
              });
            }}
            onClose={() => {
              setOpenMap(false);
            }}
          />
        )}
        <Typography variant="h6" align={"center"} color="textSecondary">
          We are here to help
        </Typography>
        <Paper className="help-layout">
          <div className="help-header">
            <div class="help-tool">
              <SelectCategory
                label="Help Category"
                helperText={`${helpList.length} ${category} providers near you.`}
                list={["Food", "Healthcare"].map((x) => ({
                  label: x,
                  value: x,
                }))}
                value={category}
                onChange={(value) => {
                  selectCategory(value.target.value);
                }}
              />
              {groups.length > 0 ? (
                <SelectCategory
                  label="Sub Category"
                  multiple={true}
                  helperText={
                    group == null
                      ? "Use to filter results"
                      : `${helpList.length} providers near you.`
                  }
                  list={groups.map((x) => ({ label: x, value: x }))}
                  value={group}
                  onChange={(value) => {
                    selectGroup(value.target.value);
                  }}
                />
              ) : null}
            </div>
            <div
              style={{
                display: "flex",
                width: "100%",
                justifyContent: "space-between",
              }}
            >
              <Button
                startIcon={<AddIcon fontSize="small" color="primary" />}
                style={{
                  marginLeft: 8,
                  alignSelf: "flex-start",
                  height: "32",
                }}
                onClick={() => {
                  openProviderRegisterDialog(true);
                }}
              >
                <Typography variant="caption" align={"center"} color="primary">
                  {`Register as a ${category.toLowerCase()} provider`}
                </Typography>
              </Button>
            </div>
          </div>
          <div class="help-list">
            <HelpList list={helpList} />
            <Button
              startIcon={<LoginIcon fontSize="small" color="primary" />}
              style={{
                height: "32",
                flexGrow: 0,
              }}
              onClick={() => {
                openProviderLoginDialog(true);
              }}
            >
              <Typography variant="caption" align={"center"} color="primary">
                {`Login here`}
              </Typography>
            </Button>
          </div>
        </Paper>
      </div>
      <ResponsiveDialog
        title={
          <div class="form-title">
            <div class="covid-logo center"></div>
            <Typography variant={"h5"} align={"center"}>
              {`${category} Registration Form`}
            </Typography>
            <Typography
              variant={"caption"}
              component={"div"}
              className={"dialog-subtext"}
            >
              {`Thanks for choosing to be a ${category.toLowerCase()} provider`}
            </Typography>
          </div>
        }
        body={
          <>
            <RegisterProvider
              setOpenMap={setOpenMap}
              location={mylocation}
              category={category}
              openProviderRegisterDialog={openProviderRegisterDialog}
            />
          </>
        }
        open={providerRegisterDialog}
        handleClose={() => {
          openProviderRegisterDialog(false);
        }}
      ></ResponsiveDialog>
      <ResponsiveDialog
        title={
          <div class="form-title">
            <div class="covid-logo center"></div>
            <Typography variant={"h5"} align={"center"} gutterBottom>
              {`Login`}
            </Typography>
            <Typography
              variant={"caption"}
              component={"div"}
              className={"dialog-subtext"}
            >
              {`If you have not received the login details contact us here +918951440987`}
            </Typography>
          </div>
        }
        body={
          <>
            <LoginProvider openProviderLoginDialog={openProviderLoginDialog} />
          </>
        }
        open={providerLoginDialog}
        handleClose={() => {
          openProviderLoginDialog(false);
        }}
      ></ResponsiveDialog>
      <Footer />
    </>
  );
}

const LoginProvider = ({ openProviderLoginDialog, onLogin }) => {
  const [loginInfo, setLoginInfo] = useState({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { username, password } = loginInfo;
  return (
    <Paper className="dialog-paper">
      <form class="help-register" noValidate autoComplete="off">
        <FormControl>
          <InputLabel htmlFor="username">Provider Username</InputLabel>
          <Input
            id="username"
            value={username}
            onChange={(e) => {
              setLoginInfo({
                ...loginInfo,
                username: e.target.value,
              });
              setError("");
            }}
          />
        </FormControl>
        <FormControl>
          <InputLabel htmlFor="address-label">Password</InputLabel>
          <Input
            id="password"
            type={"password"}
            value={password}
            onChange={(e) => {
              setLoginInfo({
                ...loginInfo,
                password: e.target.value,
              });
              setError("");
            }}
          />
          <FormHelperText id="address-helper-text">
            Forgot password? call us at +91 8951440987
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
            disabled={loading}
            startIcon={<AddIcon />}
            onClick={() => {
              setLoading(true);
              serverCall(config.hostname + "/help/login", loginInfo)
                .then((res) => {
                  window.location.href = res;
                  openProviderLoginDialog(false);
                })
                .catch((err) => {
                  setError(err);
                })
                .finally(() => setLoading(false));
            }}
          >
            {loading ? "login..." : "Login"}
          </Button>
          <Button
            variant="flat"
            color="primary"
            size="small"
            onClick={() => {
              openProviderLoginDialog(false);
            }}
            startIcon={<CloseIcon />}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Paper>
  );
};

function download(filename, text) {
  var element = document.createElement("a");
  element.setAttribute(
    "href",
    "data:text/plain;charset=utf-8," + encodeURIComponent(text)
  );
  element.setAttribute("download", filename);

  element.style.display = "none";
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}

const RegisterProvider = ({
  openProviderRegisterDialog,
  category,
  location,
  setOpenMap,
}) => {
  const [providerRegistrationDraft, setProviderDraft] = useState({
    type: "NGO",
    location,
  });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const { name, address, contact, regId, type } = providerRegistrationDraft;
  const [alertDialog, openAlert] = useState(false);
  useEffect(() => {
    setProviderDraft({
      ...providerRegistrationDraft,
      location,
    });
  }, [location]);
  return (
    <Paper className="dialog-paper">
      <ResponsiveDialog
        title={
          <>
            <Typography variant="h5" align={"center"}>
              Registration Successful!
            </Typography>
            <Typography variant="caption">
              {`Please save your credentials, it will not be shown again.`}
            </Typography>
          </>
        }
        nofullscreen={true}
        body={
          <div style={{ display: "flex", flexDirection: "column" }}>
            <Typography variant="h6" align={"center"} gutterBottom>
              Your credential
            </Typography>
            <Typography
              variant="body2"
              component="pre"
              align={"center"}
              gutterBottom
            >
              {alertDialog}
            </Typography>
            <Button
              onClick={() => download("credential.text", alertDialog)}
              color="primary"
            >
              Save Credential
            </Button>
          </div>
        }
        open={alertDialog}
        handleClose={() => {
          openAlert(false);
          openProviderRegisterDialog(false);
        }}
      />
      <div class="header-location">
        <Button
          disabled={!providerRegistrationDraft.location}
          size="small"
          color="primary"
          gutterBottom
          onClick={() => setOpenMap(true)}
          startIcon={<LocationIcon />}
        >
          {providerRegistrationDraft.location
            ? `Update Location`
            : "Locating..."}
        </Button>
        <Typography variant="caption" component="div" className="location">
          {providerRegistrationDraft.location?.addressComponent
            ? `${
                providerRegistrationDraft.location.addressComponent
                  .formattedAddress
                  ? providerRegistrationDraft.location.addressComponent
                      .formattedAddress
                  : "No address found"
              }`
            : ""}
        </Typography>
      </div>
      <form class="help-register" noValidate autoComplete="off">
        <FormControl>
          <InputLabel id="demo-simple-select-label">Type</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={type}
            onChange={(e) => {
              setProviderDraft({
                ...providerRegistrationDraft,
                type: e.target.value,
              });
            }}
          >
            <MenuItem value={"NGO"}>NGO</MenuItem>
            <MenuItem value={"Iindividual"}>Individual</MenuItem>
          </Select>
        </FormControl>
        <FormControl>
          <InputLabel htmlFor="contact-label">
            {type == "NGO" ? "Registration Number" : "Adhaar Number"}
          </InputLabel>
          <Input
            id="regId"
            value={regId}
            onChange={(e) => {
              setProviderDraft({
                ...providerRegistrationDraft,
                regId: e.target.value,
              });
              setError("");
            }}
            aria-describedby="How to connect with you"
          />
          <FormHelperText id="address-helper-text">
            Required for verification purpose
          </FormHelperText>
        </FormControl>

        <FormControl>
          <InputLabel htmlFor="component-simple">Provider Name</InputLabel>
          <Input
            id="component-simple"
            value={name}
            onChange={(e) => {
              setProviderDraft({
                ...providerRegistrationDraft,
                name: e.target.value,
              });
              setError("");
            }}
          />
        </FormControl>
        <FormControl>
          <InputLabel htmlFor="address-label">Address</InputLabel>
          <Input
            id="address"
            value={address}
            onChange={(e) => {
              setProviderDraft({
                ...providerRegistrationDraft,
                address: e.target.value,
              });
              setError("");
            }}
          />
          <FormHelperText id="address-helper-text">
            Example: city, state, pincode
          </FormHelperText>
        </FormControl>
        <FormControl>
          <InputLabel htmlFor="contact-label">Contact</InputLabel>
          <Input
            id="contact"
            value={contact}
            onChange={(e) => {
              setProviderDraft({
                ...providerRegistrationDraft,
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
              serverCall(
                config.hostname + "/help/register",
                providerRegistrationDraft
              )
                .then((res) => {
                  openAlert(res);
                })
                .catch((err) => {
                  setError(err);
                })
                .finally(() => setSaving(false));
            }}
          >
            {saving ? "saving..." : "Register"}
          </Button>
          <Button
            variant="flat"
            color="primary"
            size="small"
            onClick={() => {
              openProviderRegisterDialog(false);
            }}
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
