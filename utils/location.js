const axios = require("axios");
const HttpError = require("../models/http-error");

const API_URL = "https://nominatim.openstreetmap.org/search";

const getCoorsForAddress = async (address) => {
  const response = await axios.get(
    `${API_URL}?format=json&q=${encodeURIComponent(address)}`
  );

  const data = response.data;

  if (!data || data.length === 0) {
    throw new HttpError(
      "Could not find location for the specified address.",
      422
    );
  }

  const coordinates = {
    lat: parseFloat(data[0].lat),
    lng: parseFloat(data[0].lon),
  };

  return coordinates;
};

module.exports = getCoorsForAddress;
