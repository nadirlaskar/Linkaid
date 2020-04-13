export function getAddressFrom(res) {
  let state = res.address_components.find(
    (x) => x.types[0] === "administrative_area_level_1"
  );
  let district = res.address_components.find(
    (x) => x.types[0] === "administrative_area_level_2"
  );
  if (state == undefined) {
    state = {
      long_name: "",
      short_name: "",
    };
  }
  if (district == undefined) {
    district = {
      long_name: "",
      short_name: "",
    };
  }
  return {
    state,
    district,
    formattedAddress: res.formatted_address,
  };
}
