import axios from "axios";

const API_URL = "http://localhost:5000/api/notifications/";

const sendNotification = (donor_id, message) => {
  return axios.post(API_URL + "send", { donor_id: donor_id, message });
};

export default {
  sendNotification,
};
