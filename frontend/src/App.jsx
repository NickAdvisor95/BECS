//for routing in our application
import {
  BrowserRouter as Router,
  Route, //component that compares url with component for this url
  Routes,
  Navigate, //for redirection from one route to other
} from "react-router-dom";
//import components that will be displayed
import Login from "./components/Login";
import ChangePassword from "./components/ChangePassword";
import Dashboard from "./components/Dashboard";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/change-password" element={<ChangePassword />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

export default App;
