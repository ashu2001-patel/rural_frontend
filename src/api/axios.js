import axios from "axios";

/* ---------------- ENV ---------------- */

const USER_API =
  window.ENV?.USER_API ||
  import.meta.env.VITE_USER_API;

const ANIMAL_API =
  window.ENV?.ANIMAL_API ||
  import.meta.env.VITE_ANIMAL_API;

const PAYMENT_API =
  window.ENV?.PAYMENT_API ||
  import.meta.env.VITE_PAYMENT_API;

const TRANSLATE_API =
  window.ENV?.TRANSLATE_API ||
  import.meta.env.VITE_TRANSLATE_API;


/* ---------------- AUTH INTERCEPTOR ---------------- */

const attachToken = (config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
};


/* ---------------- AXIOS INSTANCES ---------------- */

export const userAPI = axios.create({ baseURL: USER_API });
export const animalAPI = axios.create({ baseURL: ANIMAL_API });
export const paymentAPI = axios.create({ baseURL: PAYMENT_API });

userAPI.interceptors.request.use(attachToken);
animalAPI.interceptors.request.use(attachToken);
paymentAPI.interceptors.request.use(attachToken);


/* ---------------- TRANSLATION ---------------- */

export const translateText = async (text, targetLanguage) => {
  const res = await axios.post(TRANSLATE_API, { text, targetLanguage });
  return res.data.translatedText;
};


/* ---------------- LOCATION UTILITIES ---------------- */

export const getNearbyAnimals = async (latitude, longitude, radiusKm = 50) => {
  const res = await animalAPI.get("/animal/nearby", {
    params: { latitude, longitude, radius: radiusKm }
  });
  return res.data.animals || [];
};

export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.asin(Math.sqrt(a));
  return Math.round(R * c * 10) / 10;
};

export const reverseGeocode = async (latitude, longitude) => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
      { headers: { "User-Agent": "RuralCompanyApp/1.0" } }
    );
    return await response.json();
  } catch (err) {
    console.error("Reverse geocoding error:", err);
    return null;
  }
};
