import React, { useState } from "react";
import authService from "../services/authService";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await authService.login(username, password);
      console.log("Login response:", response);
      const { token, mustChangePassword } = response;
      const userRole = JSON.parse(atob(token.split(".")[1])).role; // Получаем роль из токена
      console.log("mustChangePassword:", mustChangePassword);
      localStorage.setItem("token", token);
      localStorage.setItem("role", userRole); // Сохраняем роль в localStorage
      if (mustChangePassword) {
        navigate("/change-password");
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Login failed");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <button type="submit">Login</button>
    </form>
  );
};

export default Login;
