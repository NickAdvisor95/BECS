import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import userService from "../services/userService";
import bloodService from "../services/bloodService";
import "./Dashboard.css"; // css

const Dashboard = () => {
  const [activeForm, setActiveForm] = useState(null);
  const [showAddUserForm, setShowAddUserForm] = useState(false);
  const [showAddDonationForm, setShowAddDonationForm] = useState(false);
  const [showRequestBloodForm, setShowRequestBloodForm] = useState(false);
  const [showRequestBloodEmergencyForm, setShowRequestBloodEmergencyForm] =
    useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isResearchStudent, setIsResearchStudent] = useState(false);
  const [bloodInventory, setBloodInventory] = useState([]);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState({
    isAdmin: false,
    isRegularUser: false,
    isResearchStudent: false,
  });

  const [bloodType, setBloodType] = useState("");
  const [donationDate, setDonationDate] = useState(new Date().toISOString().split("T")[0]);
  const [donor_id, setDonorId] = useState("");
  const [donorFirstName, setDonorFirstName] = useState("");
  const [donorLastName, setDonorLastName] = useState("");
  const [donation_type, setDonationType] = useState("blood");

  const [requestBloodType, setRequestBloodType] = useState("");
  const [amount, setAmount] = useState(1);
  const [requestBloodTypeEmergency, setRequestBloodTypeEmergency] =
    useState("");
  const [amountEmergency, setAmountEmergency] = useState(1);
  const [alternativeBloodTypes, setAlternativeBloodTypes] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    console.log("Role from localStorage:", role);
    setIsAdmin(role === "admin");
    setIsResearchStudent(role === "research_student");

    if (role === "research_student") {
      fetchBloodInventory();
    }
  }, []);

  const fetchBloodInventory = async () => {
    try {
      const response = await bloodService.getBloodInventory();
      setBloodInventory(response);
    } catch (error) {
      console.error("Failed to fetch blood inventory:", error);
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      await userService.addUser({ username, password, role });
      alert("User added successfully!");
      setActiveForm(null);
      setUsername("");
      setPassword("");
      setRole({
        isAdmin: false,
        isRegularUser: false,
        isResearchStudent: false,
      });
    } catch (error) {
      alert("Failed to add user");
    }
  };

  const handleAddDonation = async (e) => {
    e.preventDefault();
    try {
      await bloodService.addDonation({
        bloodType,
        donationDate,
        donor_id,
        donorFirstName,
        donorLastName,
        donation_type,
      });
      alert("Donation added successfully!");
      setActiveForm(null);
      setBloodType("");
      setDonorId("");
      setDonorFirstName("");
      setDonorLastName("");
      setDonationType("blood");
    } catch (error) {
      alert("Failed to add donation");
    }
  };

  const handleRequestBlood = async (e) => {
    e.preventDefault();
    try {
      const response = await bloodService.requestBlood({
        bloodType: requestBloodType,
        amount,
      });
      console.log("Response:", response);

      if (response.message === "Blood requested successfully") {
        alert("Blood requested successfully!");
      } else if (response.alternatives) {
        setAlternativeBloodTypes(response.alternatives);
        alert(
          "Requested blood type not available. Alternatives: " +
            response.alternatives.join(", ")
        );
      } else {
        alert(response.message || "Unknown error");
      }

      setActiveForm(null);
      setRequestBloodType("");
      setAmount(0);
      setAlternativeBloodTypes([]);
    } catch (error) {
      console.error("Failed to request blood:", error);
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        alert(error.response.data.message);
      } else {
        alert("Failed to request blood");
      }
    }
  };

  const handleRequestBloodEmergency = async (e) => {
    e.preventDefault();
    try {
      const response = await bloodService.requestBloodEmergency({
        bloodType: requestBloodTypeEmergency,
        amount: amountEmergency,
      });
      console.log("Response:", response);

      if (response.message === "Blood requested successfully in emergency") {
        alert("Blood requested successfully in emergency!");
      } else {
        alert(response.message || "Unknown error");
      }

      setActiveForm(null);
      setRequestBloodTypeEmergency("");
      setAmountEmergency(0);
    } catch (error) {
      console.error("Failed to request blood in emergency:", error);
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        alert(error.response.data.message);
      } else {
        alert("Failed to request blood in emergency");
      }
    }
  };

  const handleDownloadLogs = async () => {
    try {
      const response = await bloodService.downloadLogs();
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "audit_logs.pdf");
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error("Failed to download logs:", error);
      alert("Failed to download logs");
    }
  };

  return (
    <div className="dashboard-container">
      <h1>Welcome to the Dashboard</h1>

      {isResearchStudent ? (
        <div>
          <h2>Blood Inventory for Research</h2>
          <table>
            <thead>
              <tr>
                <th>Blood Type</th>

                <th>Available Units</th>
              </tr>
            </thead>
            <tbody>
              {bloodInventory.map((item, index) => (
                <tr key={index}>
                  <td>{item.bloodType}</td>

                  <td>{item.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
          <div className="dashboard-buttons">
            {isAdmin && (
                <>
                  <button onClick={() => setActiveForm(activeForm === "addUser" ? null : "addUser")}
                          className={activeForm === "addUser" && "close-form"}>
                    {activeForm === "addUser" ? "Close Form" : "Add User"}
                  </button>
                  <button onClick={handleDownloadLogs}>Download Logs</button>
                </>
            )}

            <button onClick={() => setActiveForm(activeForm === "addDonations" ? null : "addDonations")}
                    className={activeForm === "addDonations" && "close-form"}>
              {activeForm === "addDonations" ? "Close Form" : "Add Donation"}
            </button>

            <button
                onClick={() => setActiveForm(activeForm === "requestBlood" ? null : "requestBlood")}
                className={activeForm === "requestBlood" && "close-form"}
            >
              {activeForm === "requestBlood" ? "Close Form" : "Request Blood"}
            </button>

            <button
                onClick={() => setActiveForm(activeForm === "requestBloodEmergency" ? null : "requestBloodEmergency")}
                className={activeForm === "requestBloodEmergency" && "close-form"}
            >
              {activeForm === "requestBloodEmergency" ? "Close Form" : "Request Blood Emergency"}
            </button>
          </div>
      )}

      {activeForm === "addUser" && (
          <form onSubmit={handleAddUser}>
            <input
              type="checkbox"
              checked={role.isRegularUser}
              onChange={(e) =>
                setRole({ ...role, isRegularUser: e.target.checked })
              }
            />
          </label>
          <label>
            Research Student:
            <input
              type="checkbox"
              checked={role.isResearchStudent}
              onChange={(e) =>
                setRole({ ...role, isResearchStudent: e.target.checked })
              }
            />
          </label>
          <button type="submit">Create User</button>
        </form>
      )}

      {activeForm === "addDonations" && (
          <form onSubmit={handleAddDonation}>
            <input
                type="text"
                value={bloodType}
                onChange={(e) => setBloodType(e.target.value)}
                placeholder="Blood Type"
                required
            />
            <input
                type="date"
                value={donationDate}
                onChange={(e) => setDonationDate(e.target.value)}
                placeholder="Donation Date"
                required
            />
            <input
                type="text"
                value={donor_id}
                onChange={(e) => setDonorId(e.target.value)}
                placeholder="Donor ID"
                required
            />
            <input
                type="text"
                value={donorFirstName}
            onChange={(e) => setDonorFirstName(e.target.value)}
            placeholder="Donor First Name"
            required
          />
          <input
            type="text"
            value={donorLastName}
            onChange={(e) => setDonorLastName(e.target.value)}
            placeholder="Donor Last Name"
            required
          />
          <label>
            Donation Type:
            <select
              value={donation_type}
              onChange={(e) => setDonationType(e.target.value)}
            >
              <option value="blood">Blood</option>
              <option value="plasma">Plasma</option>
            </select>
          </label>
          <button type="submit">Add Donation</button>
        </form>
      )}

      {activeForm === "requestBlood" && (
        <form onSubmit={handleRequestBlood}>
          <input
            type="text"
            value={requestBloodType}
            onChange={(e) => setRequestBloodType(e.target.value)}
            placeholder="Blood Type"
            required
          />
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Amount"
            min="1"
            required
          />
          <button type="submit">Request Blood</button>
        </form>
      )}

      {activeForm === "requestBloodEmergency" && (
        <form onSubmit={handleRequestBloodEmergency}>
          <input
            type="text"
            value={requestBloodTypeEmergency}
            onChange={(e) => setRequestBloodTypeEmergency(e.target.value)}
            placeholder="Blood Type"
            required
          />
          <input
            type="number"
            value={amountEmergency}
            onChange={(e) => setAmountEmergency(e.target.value)}
            placeholder="Amount"
            min="1"
            required
          />
          <button type="submit">Request Blood Emergency</button>
        </form>
      )}
    </div>
  );
};

export default Dashboard;
