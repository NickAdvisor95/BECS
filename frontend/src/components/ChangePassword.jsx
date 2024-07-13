import React, { useState } from "react";
import authService from "../services/authService";
import { useNavigate } from "react-router-dom";

const ChangePassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await authService.changePassword(newPassword);
      navigate("/dashboard");
    } catch (error) {
      alert("Failed to change password");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        placeholder="New Password"
        required
      />
      <button type="submit">Change Password</button>
    </form>
  );
};

export default ChangePassword;
