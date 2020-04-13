import React, { useState, useEffect, useRef } from "react";
import "./App.css";
import Typography from "@material-ui/core/Typography";
import InputBase from "@material-ui/core/InputBase";
import GPSIcon from "@material-ui/icons/GpsFixedRounded";
import Dialog from "./DrawerMUI";
import { Button, Hidden, Paper } from "@material-ui/core";
import { Map, InfoWindow, Marker, GoogleApiWrapper } from "google-maps-react";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import SearchIcon from "@material-ui/icons/Search";
import { google_api_key, GA_KEY } from "./config";
import ReactGA from "react-ga";
ReactGA.initialize(GA_KEY);
const YOUR_GOOGLE_MAP_API_KEY = google_api_key;

const options = {
  mapTypeControl: false,
  streetViewControl: false,
  fullscreenControl: false,
};

function geocodeLatLng(geocoder, latlng) {
  return new Promise((resolve, reject) =>
    geocoder.geocode(
      { location: { lat: latlng.latitude, lng: latlng.longitude } },
      function (results, status) {
        if (status === "OK") {
          if (results[0]) {
            resolve(results);
          } else {
            reject("No results found");
          }
        } else {
          reject("Geocoder failed due to: " + status);
        }
      }
    )
  );
}

const MapsContainer = ({
  google,
  open,
  openDialog,
  currentLocation,
  locationUpdate,
  onClose,
  onEncodedLocation = () => {},
  fullscreen,
  markerList,
  onMarkerClick = () => {},
  page = "unknown",
}) => {
  const [mapConfig, setMapConfig] = useState({});
  const searchRef = useRef(null);
  const handlePlaces = (searchBox) => {
    var places = searchBox.getPlaces();
    const { map } = mapConfig;
    if (places.length == 0) {
      return;
    }
    // For each place, get the icon, name and location.
    var bounds = new google.maps.LatLngBounds();
    places.forEach(function (place) {
      if (!place.geometry) {
        console.log("Returned place contains no geometry");
        return;
      }

      if (place.geometry.viewport) {
        // Only geocodes have viewport.
        bounds.union(place.geometry.viewport);
      } else {
        bounds.extend(place.geometry.location);
      }
    });

    let latlng = {
      latitude: places[0].geometry.location.lat(),
      longitude: places[0].geometry.location.lng(),
      resolvedAddress: places[0],
      accuracy: mapConfig.map.getZoom(),
    };
    locationUpdate(latlng, 0);
    map.fitBounds(bounds);
  };
  useEffect(() => {
    if (searchRef.current != null && mapConfig.map) {
      console.log("ref changed", searchRef);
      mapConfig.map.controls[google.maps.ControlPosition.TOP_LEFT].push(
        searchRef.current
      );
      var searchBox = new google.maps.places.SearchBox(searchRef.current);
      searchBox.addListener("places_changed", () => {
        console.log("places changed");
        handlePlaces(searchBox);
      });
      // Bias the SearchBox results towards current map's viewport.
      mapConfig.map.addListener("bounds_changed", function () {
        searchBox.setBounds(mapConfig.map.getBounds());
      });
    }
  }, [searchRef, mapConfig.map]);
  useEffect(() => {
    if (currentLocation !== null) {
      let geocoder = new google.maps.Geocoder();
      geocodeLatLng(geocoder, currentLocation)
        .then((res) => {
          console.log("geo", res);
          onEncodedLocation(res[0]);
        })
        .catch((err) => console.error(err));
      setMapConfig({
        ...mapConfig,
        geocoder,
      });
    }
  }, []);

  useEffect(() => {
    ReactGA.set({
      userLocation: `${page}-${[currentLocation.latitude, currentLocation.longitude].join(',')}`,
    });
    ReactGA.event({
      category: `${page}-location`,
      action: [currentLocation.latitude, currentLocation.longitude].join(',')
    });
  }, [currentLocation]);

  const markers = markerList ? markerList : [currentLocation];
  const _map = (
    <div
      class={`my-map-wrapper ${fullscreen ? " fullscreen" : ""}`}
      style={{
        visibility: mapConfig.map ? "visible" : "hidden",
      }}
    >
      <div style={{ visibility: "hidden" }}>
        <input
          ref={searchRef}
          id="pac-input"
          class="controls search-wrapper"
          type="text"
          placeholder="Search places"
        />
      </div>
      <Map
        google={google}
        initialCenter={{
          lat: currentLocation.latitude,
          lng: currentLocation.longitude,
        }}
        center={{
          lat: currentLocation.latitude,
          lng: currentLocation.longitude,
        }}
        zoom={15}
        onReady={(mProps, map) => {
          // Set all maps options
          for (var option in options) {
            map.set(option, options[option]);
          }
          // Update map config
          setMapConfig({
            ...mapConfig,
            map,
          });
        }}
      >
        {markers.map((location, markerId) => (
          <Marker
            key={markerId}
            zIndex={markerId == 0 ? 100 : 0}
            draggable={
              location.draggable !== undefined ? location.draggable : true
            }
            icon={{
              url: location.icon?.url ? location.icon.url : "/person_pin.svg",
              anchor: new google.maps.Point(20, 40),
              scaledSize:
                markerId == 0
                  ? new google.maps.Size(40, 40)
                  : new google.maps.Size(32, 32),
            }}
            onClick={() => {
              onMarkerClick(markerId);
            }}
            onDragend={(t, map, coords) => {
              console.log(coords);
              if (coords.latLng && coords.latLng) {
                let latlng = {
                  latitude: coords.latLng.lat(),
                  longitude: coords.latLng.lng(),
                  accuracy: mapConfig.map.getZoom(),
                };
                geocodeLatLng(mapConfig.geocoder, latlng)
                  .then((res) => {
                    console.log(res);
                    latlng.resolvedAddress = res[0];
                  })
                  .catch((err) => console.error(err))
                  .finally(() => {
                    console.log("update", latlng);
                    locationUpdate(latlng, markerId);
                  });
              }
            }}
            position={{
              lat: location.latitude,
              lng: location.longitude,
            }}
          />
        ))}
      </Map>
    </div>
  );

  return !fullscreen ? (
    <Dialog
      anchor={"bottom"}
      open={open}
      onClose={() => {
        onClose();
      }}
    >
      {_map}
    </Dialog>
  ) : (
    _map
  );
};

export default GoogleApiWrapper({
  apiKey: YOUR_GOOGLE_MAP_API_KEY,
  LoadingContainer: () => null,
})(MapsContainer);
