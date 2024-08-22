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
// axios.interceptors.request.use(request => {
//   console.log('Starting Request', request)
//   return request
// })

// axios.interceptors.response.use(response => {
//   console.log('Response:', response)
//   return response
// })

export default axios;
