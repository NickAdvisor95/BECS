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

const registrationDonation = async (donationData) => {
  const token = localStorage.getItem("token");
  const response = await axios.post(
    API_URL + "registration-donor",
    donationData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

const useDonation = async (donationId) => {
  const token = localStorage.getItem("token");
  const response = await axios.post(
    API_URL + "use-donation",
    { donationId },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
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

const requestBloodEmergency = async (requestData) => {
  const token = localStorage.getItem("token");
  const response = await axios.post(
    API_URL + "request-blood-emergency",
    requestData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

const downloadLogs = async () => {
  const token = localStorage.getItem("token");
  const response = await axios.get(API_URL + "download-logs", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    responseType: "blob",
  });
  return response;
};

const getBloodInventory = async () => {
  const token = localStorage.getItem("token");
  const response = await axios.get(API_URL + "blood-inventory", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export default {
  addDonation,
  registrationDonation,
  useDonation,
  requestBlood,
  requestBloodEmergency,
  downloadLogs,
  getBloodInventory,
};
