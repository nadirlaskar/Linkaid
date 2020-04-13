import React, { useState, useEffect } from "react";
import "./App.css";
import SearchBoxMui from "./SearchBoxMUI";
import HelpList from "./HelpList";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import ButtonBase from "@material-ui/core/ButtonBase";
import Button from "@material-ui/core/Button";
import AddIcon from "@material-ui/icons/AddCircleOutline";
import LoginIcon from "@material-ui/icons/PersonRounded";
import CloseIcon from "@material-ui/icons/CloseOutlined";
import Paper from "@material-ui/core/Paper";
import Links from "./Links";
import SelectCategory from "./Select";
import ResponsiveDialog from "./ResponsiveDialog";
import FormControl from "@material-ui/core/FormControl";
import FormHelperText from "@material-ui/core/FormHelperText";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { hostname } from "./config";
import { geolocated } from "react-geolocated";
import MapLocate from "./MapLocate";
import { getAddressFrom } from "./utils";
import "./help.css";
import LocationIcon from "@material-ui/icons/GpsFixedOutlined";
import LocationNIcon from "@material-ui/icons/GpsNotFixedOutlined";
import Footer from "./Footer";
import Header from "./Header";
const draftSetting = {
  food: {
    location: {
      label: "Location",
      helperText: "Select your location",
      type: "geolocation",
    },
    active: { label: "Is Active?", helperText: "", type: "switch" },
    group: {
      label: "Tags",
      helperText: "Sub category for eg. type of items distributed",
      type: "autocomplete",
    },
    capacity: {
      label: "Meals",
      helperText: "No. of available meal units",
      type: "text",
    },
    range: {
      label: "Range",
      helperText: "Area in meters you provide service",
      type: "text",
    },
    address: {
      label: "Address",
      helperText: "Provide detailed address",
      type: "text",
    },
    contactPerson: {
      label: "Contact",
      helperText: "Example +910234567890, +911234567897",
      type: "text",
    },
    comment: {
      label: "Comment",
      helperText: "Something the visitor should know",
      type: "text",
    },
  },
  healthcare: {
    location: {
      label: "Location",
      helperText: "Select your location",
      type: "geolocation",
    },
    active: { label: "Is Active?", helperText: "", type: "switch" },
    group: {
      label: "Tags",
      helperText: "Sub category for eg. type of items distributed",
      type: "autocomplete",
    },
    capacity: {
      label: "Capacity",
      helperText: "No of beds available",
      type: "text",
    },
    range: {
      label: "Range",
      helperText: "Area in meters you provide service",
      type: "text",
    },
    address: {
      label: "Address",
      helperText: "Provide detailed address",
      type: "text",
    },
    contactPerson: {
      label: "Contact",
      helperText: "Example Example: +910234567890, +911234567897",
      type: "text",
    },
    comment: {
      label: "Comment",
      helperText: "Something other visitor know",
      type: "text",
    },
  },
};
const draftItem = {
  food: {
    active: true,
    location: "",
    group: "",
    address: "",
    contactPerson: "",
    capacity: "",
    range: "",
    comment: "",
  },
  healthcare: {
    active: true,
    location: "",
    group: "",
    address: "",
    contactPerson: "",
    capacity: "",
    range: "",
    comment: "",
  },
};
let PROVIDER = "";
const fetchStore = () => {
  return serverCall(hostname + "/help/admin/list");
};
const getGroups = (data) => {
  return data
    ? Array.from(
        new Set(
          Object.values(data)
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
  const [store, setStore] = useState({
    food: [],
    healthcare: [],
  });
  const [helpList, setHelpList] = useState([]);
  let list = store[category.toLowerCase()];
  const [providerDialog, openProviderDialog] = useState(false);
  const [providerLoginDialog, openProviderLoginDialog] = useState(false);
  const [draft, setDraft] = useState(null);
  const [groups, setGroups] = useState([]);
  const [openMap, setOpenMap] = useState(false);
  const [mylocation, setMyLocation] = useState(null);
  useEffect(() => {
    fetchStore()
      .then((res) => {
        PROVIDER = res.user;
        setGroups(getGroups(res.store[category.toLowerCase()]));
        setStore(res.store);
      })
      .catch((err) => {
        console.log(err);
        openProviderLoginDialog(true);
      });
  }, []);

  useEffect(() => {
    setGroups(getGroups(store[category.toLowerCase()]));
  }, [category, store]);

  useEffect(() => {
    let list = store[category.toLowerCase()];
    let helpList = list.map((item) => {
      return {
        title: item.address,
        provider: PROVIDER,
        description: item.comment,
        count: item.capacity,
        contactPerson: item.contactPerson,
        distance: "",
        active: item.active,
        navigation: null,
      };
    });
    setHelpList(helpList);
  }, [store, category]);

  useEffect(() => {
    if (Number.isInteger(providerDialog)) {
      setDraft({
        ...list[providerDialog - 1],
      });
    } else if (providerDialog) {
      setDraft({
        ...draftItem[category.toLowerCase()],
        location: {
          latitude: mylocation.latitude,
          longitude: mylocation.longitude,
          addressComponent: mylocation.addressComponent,
        },
      });
    } else if (providerDialog === false) {
      setDraft(null);
    }
  }, [providerDialog]);

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

  return (
    <>
      <div class="help-wrapper">
        <Header type="admin" />
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
        <Typography variant="h6" align={"center"} color="textSecondary">
          {PROVIDER ? `${PROVIDER}'s Help Dashboard` : "Login to continue"}
        </Typography>
        <Typography variant="caption" align={"center"} color="textSecondary">
          {PROVIDER
            ? "Thankyou! for being a provider in our platform."
            : "Your session has expired."}
        </Typography>
        <Paper className="help-layout" elevation={1}>
          {mylocation !== null && (
            <MapLocate
              page="admin"
              currentLocation={draft?.location || mylocation}
              open={openMap}
              onEncodedLocation={(resolvedAddress) => {
                let address = getAddressFrom(resolvedAddress);
                setMyLocation({
                  ...mylocation,
                  addressComponent: address,
                });
              }}
              locationUpdate={(pos) => {
                console.log("update", pos);
                let address = getAddressFrom(pos.resolvedAddress);
                if (draft == null) {
                  setMyLocation({
                    ...mylocation,
                    latitude: pos.latitude,
                    longitude: pos.longitude,
                    addressComponent: address,
                  });
                } else {
                  setDraft({
                    ...list[providerDialog - 1],
                    location: {
                      latitude: pos.latitude,
                      longitude: pos.longitude,
                      addressComponent: address,
                    },
                  });
                }
              }}
              onClose={() => {
                setOpenMap(false);
              }}
            />
          )}
          <div className="help-header admin">
            <SelectCategory
              label="Help Category"
              helperText={`You have added ${list.length} ${category} items`}
              list={["Food", "Healthcare"].map((x) => ({ label: x, value: x }))}
              value={category}
              onChange={(value) => {
                selectCategory(value.target.value);
              }}
            />
            <Button
              startIcon={<AddIcon fontSize="small" color="primary" />}
              style={{
                marginLeft: 8,
                justifyContent: "flex-start",
                height: "32",
              }}
              onClick={() => {
                openProviderDialog(true);
              }}
            >
              <Typography variant="caption" align={"center"} color="primary">
                {`Add a new ${category.toLowerCase()} site`}
              </Typography>
            </Button>
          </div>
          <div class="help-list">
            <HelpList
              list={helpList}
              type="admin"
              onEdit={(i) => {
                openProviderDialog(i);
              }}
            />
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
      {/*Register*/}
      <ResponsiveDialog
        forceFullscreen={true}
        title={
          <div class="form-title">
            <Typography variant={"h6"} align={"center"}>
              {`Add new ${category} site`}
            </Typography>
            <Typography
              variant={"caption"}
              component={"div"}
              className={"dialog-subtext"}
            >
              {`Fillup the following details`}
            </Typography>
          </div>
        }
        body={
          <EditItemProvider
            setDraft={setDraft}
            isGeolocationAvailable={isGeolocationAvailable}
            isGeolocationEnabled={isGeolocationEnabled}
            currentLocation={mylocation}
            category={category}
            groups={groups}
            openProviderDialog={openProviderDialog}
            providerDraft={draft}
            draftSetting={draftSetting[category.toLowerCase()]}
            categoryList={list}
            store={store}
            providerDialog={providerDialog}
            openLogin={openProviderLoginDialog}
            setOpenMap={setOpenMap}
            onSave={(store) => {
              setStore(store);
            }}
          />
        }
        open={providerDialog}
        handleClose={() => {
          openProviderDialog(false);
        }}
      ></ResponsiveDialog>
      {/*Login*/}
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
              color="secondaryText"
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
              serverCall(hostname + "/help/login", loginInfo)
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
const EditItemProvider = ({
  isGeolocationAvailable,
  isGeolocationEnabled,
  currentLocation,
  openProviderDialog,
  category,
  groups,
  draftSetting,
  providerDraft,
  categoryList,
  store,
  providerDialog,
  onSave,
  openLogin,
  setOpenMap,
  setDraft,
}) => {
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  if (providerDraft == null) return null;
  const keys = Object.keys(draftItem[category.toLowerCase()]);
  console.log(providerDraft);
  return (
    <Paper className="dialog-paper">
      <div class="header-location">
        <Button
          disabled={!providerDraft.location}
          size="small"
          color="primary"
          gutterBottom
          onClick={() => setOpenMap(true)}
          startIcon={<LocationIcon />}
        >
          {providerDraft.location ? `Update Location` : "Locating..."}
        </Button>
        <Typography variant="caption" component="div" className="location">
          {providerDraft.location?.addressComponent
            ? `${
                providerDraft.location.addressComponent.formattedAddress
                  ? providerDraft.location.addressComponent.formattedAddress
                  : "No address found"
              }`
            : ""}
        </Typography>
      </div>
      <form class="help-register" noValidate autoComplete="off">
        {keys
          .filter((key) => draftSetting[key] !== undefined)
          .map((key) => {
            return (
              <FormControl size={"small"}>
                {draftSetting[key].type == "text" ? (
                  <>
                    <InputLabel htmlFor={key}>
                      {draftSetting[key].label}
                    </InputLabel>
                    <Input
                      id={key}
                      value={providerDraft[key]}
                      onChange={(e) => {
                        setDraft({
                          ...providerDraft,
                          [key]: e.target.value,
                        });
                        setError("");
                      }}
                    />
                    <FormHelperText id={`${key}-helper-text`}>
                      {draftSetting[key].helperText}
                    </FormHelperText>
                  </>
                ) : draftSetting[key].type == "switch" ? (
                  <FormGroup row>
                    <FormControlLabel
                      size="small"
                      control={
                        <Switch
                          size="small"
                          checked={providerDraft[key]}
                          onChange={(e) => {
                            setDraft({
                              ...providerDraft,
                              [key]: !providerDraft[key],
                            });
                            setError("");
                          }}
                          name={key}
                          color="primary"
                        />
                      }
                      label={
                        <Typography variant="caption">
                          {draftSetting[key].label}
                        </Typography>
                      }
                    />
                  </FormGroup>
                ) : draftSetting[key].type == "autocomplete" ? (
                  <Autocomplete
                    options={groups}
                    getOptionLabel={(option) => option}
                    value={
                      providerDraft[key] instanceof Array
                        ? providerDraft[key]
                        : providerDraft[key]
                        ? [providerDraft[key]]
                        : []
                    }
                    freeSolo={true}
                    multiple={true}
                    size={"small"}
                    filterSelectedOptions={true}
                    onChange={(e, newValue) => {
                      if (newValue !== null)
                        setDraft({
                          ...providerDraft,
                          [key]: newValue.map((x) => x.toLowerCase()),
                        });
                      setError("");
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label={draftSetting[key].label}
                        margin="none"
                        helperText={draftSetting[key].helperText}
                      />
                    )}
                  />
                ) : null}
              </FormControl>
            );
          })}
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
              var update = [...categoryList];
              var isNew = !Number.isInteger(providerDialog);
              if (isNew) {
                update.push(providerDraft);
              } else {
                update[providerDialog - 1] = providerDraft;
              }
              setSaving(true);
              serverCall(
                `${hostname}/help/admin/update`,
                {
                  ...store,
                  [category.toLowerCase()]: update,
                },
                true
              )
                .then((res) => {
                  onSave(res);
                  openProviderDialog(false);
                })
                .catch((err) => {
                  openProviderDialog(false);
                  openLogin(true);
                  setError(err);
                })
                .finally(() => setSaving(false));
            }}
          >
            {"Save"}
          </Button>
          <Button
            color="primary"
            size="small"
            onClick={() => {
              openProviderDialog(false);
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
