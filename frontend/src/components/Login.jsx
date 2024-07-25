import { useState } from "react";
import authService from "../services/authService"; //functions for work with authentification
import { useNavigate } from "react-router-dom"; //for navigation between pages

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); //function for moving to other pages

  //this function called when the form is sending
  const handleSubmit = async (e) => {
    e.preventDefault(); //avoid reload page when the form is sending
    try {
      const response = await authService.login(username, password); //send request to server for authentification user
      console.log("Login response:", response);
      const { token, mustChangePassword } = response;
      const userRole = JSON.parse(atob(token.split(".")[1])).role; // take role from token
      console.log("mustChangePassword:", mustChangePassword);
      localStorage.setItem("token", token);
      localStorage.setItem("role", userRole); // save role in localStorage
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
