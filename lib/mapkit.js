import axios from "axios";
import jwt from "jsonwebtoken";

export async function geocode(address) {
  const url = `https://maps-api.apple.com/v1/geocode?q=${encodeURIComponent(address)}&limitToCountries=FR`;
  const token = await getServerToken();

  try {
    const result = await axios
      .get(url, { headers: { Authorization: `Bearer ${token}` } })

    if (!result.data.results || !result.data.results[0]) {
      return { error: "Geocoding error: No results for this address", payload: result.data };
    }
  
    const { latitude: lat, longitude: lng } = result.data.results[0].coordinate;
    return { coordinate: { lat, lng } } ;
  } catch (error) {
    console.error("Error connecting to geocoding servie:", error.stack);
    return { error };
  }
}

async function getServerToken() {
  const url = "https://maps-api.apple.com/v1/token";
  const token = getToken();

  const results = await axios.get(url, { headers: { Authorization: `Bearer ${token}` } });
  return results.data.accessToken;
}

export function getToken() {
  const header = {
    alg: "ES256",
    kid: process.env.MAPKIT_KID,
    typ: "JWT"
  };
  const payload = {
    iss: process.env.APPLE_TEAM_ID,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 60 * 60,
  };
  if (process.env.ORIGIN) {
    payload.origin = process.env.ORIGIN;
  }

  const token = jwt.sign(payload, process.env.MAPKIT_SECRET, { header });
  return token;
}