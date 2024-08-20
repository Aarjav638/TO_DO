// axiosConfig.ts
import axios from "axios";

// Set base URL once for all requests
axios.defaults.baseURL = "http://192.168.1.7:7000/api/v1/";

// Function to set the Authorization header
export const setAuthToken = (token: string | null) => {
  if (token) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common["Authorization"];
  }
};

export default axios;
