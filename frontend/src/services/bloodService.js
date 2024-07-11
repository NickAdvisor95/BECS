import axios from "axios";

const API_URL = "http://localhost:5000/api/";

const addDonation = async (donationData) => {
  const token = localStorage.getItem("token");
  const response = await axios.post(API_URL + "add-donation", donationData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

const requestBlood = async (requestData) => {
  const token = localStorage.getItem("token");
  const response = await axios.post(API_URL + "request-blood", requestData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export default {
  addDonation,
  requestBlood,
};
