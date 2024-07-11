import React, { useState } from "react";
import donorService from "../services/donorService";

const AddDonor = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    passport_Id: "",
    blood_type: "",
    birth_date: "",
    health_condition: "",
    insurance: "",
    email: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await donorService.addDonor(formData);
      alert("Donor added successfully!");
    } catch (error) {
      alert("Error adding donor");
      console.error("Error adding donor:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="firstName"
        placeholder="First Name"
        value={formData.firstName}
        onChange={handleChange}
      />
      <input
        name="lastName"
        placeholder="Last Name"
        value={formData.lastName}
        onChange={handleChange}
      />
      <input
        name="passport_Id"
        placeholder="Passport ID"
        value={formData.passport_Id}
        onChange={handleChange}
      />
      <input
        name="blood_type"
        placeholder="Blood Type"
        value={formData.blood_type}
        onChange={handleChange}
      />
      <input
        name="birth_date"
        type="date"
        value={formData.birth_date}
        onChange={handleChange}
      />
      <textarea
        name="health_condition"
        placeholder="Health Condition"
        value={formData.health_condition}
        onChange={handleChange}
      ></textarea>
      <input
        name="insurance"
        placeholder="Insurance"
        value={formData.insurance}
        onChange={handleChange}
      />
      <input
        name="email"
        type="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
      />
      <button type="submit">Add Donor</button>
    </form>
  );
};

export default AddDonor;
