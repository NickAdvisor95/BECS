import axios from "axios";

const API_URL = "http://localhost:5000/api/donors/";

const getDonors = () => {
  return axios.get(API_URL);
};

const addDonor = (donorData) => {
  return axios.post(API_URL + "add", donorData);
};

export default {
  getDonors,
  addDonor,
};
