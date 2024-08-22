// axiosConfig.ts
import axios from "axios";

// Set base URL once for all requests
axios.defaults.baseURL = "https://to-do-i529.vercel.app/api/v1/";

// Function to set the Authorization header
export const setAuthToken = (token: string | null) => {
  console.log("Setting token:", token);
  if (token) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common["Authorization"];
  }
};

export default axios;
