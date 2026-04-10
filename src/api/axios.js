import axios from "axios";

const USER_API = window.ENV?.USER_API || import.meta.env.VITE_USER_API;
const ANIMAL_API = window.ENV?.ANIMAL_API || import.meta.env.VITE_ANIMAL_API;
const TOOL_API = window.ENV?.TOOL_API || import.meta.env.VITE_TOOL_API;
const TRANSLATE_API = window.ENV?.TRANSLATE_API || import.meta.env.VITE_TRANSLATE_API;

export const userAPI = axios.create({
  baseURL: USER_API,
});

export const animalAPI = axios.create({
  baseURL: ANIMAL_API,
});

export const toolAPI = axios.create({
  baseURL: TOOL_API,
});

const attachToken = (config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
};

userAPI.interceptors.request.use(attachToken);
animalAPI.interceptors.request.use(attachToken);
toolAPI.interceptors.request.use(attachToken);

export const translateText = async (text, targetLanguage) => {
  const res = await axios.post(TRANSLATE_API, { text, targetLanguage });
  return res.data.translatedText;
};