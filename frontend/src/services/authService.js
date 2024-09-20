import axios from "axios";

const API_URL = "http://localhost:5000/api/";

const login = async (username, password) => {
  //send http request using axios.post. post is method in lybrary of axios that send http post request.
  //1-st parameter is the url to which we send request . 2-nd object with username and password that user entered
  const response = await axios.post(API_URL + "login", { username, password });
  return response.data;
};

const changePassword = async (newPassword) => {
  const token = localStorage.getItem("token");
  await axios.post(
    API_URL + "change-password",
    { newPassword },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

const logout = async () => {
  const token = localStorage.getItem("token");
  await axios.post(
      API_URL + "logout",
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
  );

  // Remove token from local storage after successful logout
  localStorage.removeItem("token");
};

export default {
  login,
  changePassword,
  logout
};
