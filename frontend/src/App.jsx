//for routing in our application
import {
    Route, //component that compares url with component for this url
    Routes,
    Navigate, //for redirection from one route to other
    useNavigate, useLocation
} from "react-router-dom";
//import components that will be displayed
import Login from "./components/Login";
import ChangePassword from "./components/ChangePassword";
import Dashboard from "./components/Dashboard";
import authService from './services/authService.js';

const App = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await authService.logout();
    navigate("/login"); // Redirect to login after logout
  };

  return (
      <>
          <nav>
              {!['/login', '/change-password'].includes(location.pathname) && (
                  <button
                      style={{backgroundColor: "#28a745"}}
                      onClick={handleLogout}>Logout</button>
              )}
          </nav>
        <Routes>
          <Route path="/login" element={<Login/>}/>
          <Route path="/change-password" element={<ChangePassword/>}/>
          <Route path="/dashboard" element={<Dashboard/>}/>
          <Route path="*" element={<Navigate to="/login"/>}/>
        </Routes>
      </>
  );
};

export default App;
