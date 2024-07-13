import axios from "axios";

const API_URL = "http://localhost:5000/api/";

const login = async (username, password) => {
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

export default {
  login,
  changePassword,
};
