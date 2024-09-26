import axios from "axios";

const getWeather = async (lat, lon) => {
  const api_key = import.meta.env.VITE_APIKEY;
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${api_key}`;
  console.log("getWeather req url:", url);
  const req = axios.get(url);

  return req.then((res) => res.data);
};

const getIcon = (icon) => {
  return `https://openweathermap.org/img/wn/${icon}@2x.png`;
};

export default { getWeather, getIcon };
