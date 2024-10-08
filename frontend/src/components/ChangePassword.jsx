import { useState, useRef, useEffect } from "react";
import authService from "../services/authService";
import { useNavigate } from "react-router-dom";

const ChangePassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const navigate = useNavigate();
  const firstInputRef = useRef(null);

  useEffect(() => {
    if (firstInputRef.current) {
      firstInputRef.current.focus();
    }
  }, []);

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
        ref={firstInputRef}
      />
      <button type="submit">Change Password</button>
    </form>
  );
};

export default ChangePassword;
