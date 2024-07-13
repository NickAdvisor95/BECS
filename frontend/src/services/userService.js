import axios from "axios";

const API_URL = "http://localhost:5000/api/";

const addUser = async (userData) => {
  const token = localStorage.getItem("token");
  const response = await axios.post(API_URL + "add-user", userData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export default {
  addUser,
};
