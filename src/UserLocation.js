function geoFindMe(onStatus) {
  return new Promise((onSuccess, onError) => {
    if (!navigator.geolocation) {
      onStatus(-1);
    } else {
      onStatus(0);
      navigator.geolocation.getCurrentPosition(onSuccess, onError);
    }
  });
}
export default geoFindMe;
