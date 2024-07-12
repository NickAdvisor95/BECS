import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import userService from "../services/userService";
import bloodService from "../services/bloodService";

const Dashboard = () => {
  const [showAddUserForm, setShowAddUserForm] = useState(false);
  const [showAddDonationForm, setShowAddDonationForm] = useState(false);
  const [showRequestBloodForm, setShowRequestBloodForm] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState({
    isAdmin: false,
    isRegularUser: false,
    isResearchStudent: false,
  });

  const [bloodType, setBloodType] = useState("");
  const [donationDate, setDonationDate] = useState("");
  const [donor_id, setDonorId] = useState("");
  const [donorFirstName, setDonorFirstName] = useState("");
  const [donorLastName, setDonorLastName] = useState("");
  const [donation_type, setDonationType] = useState("blood");

  const [requestBloodType, setRequestBloodType] = useState("");
  const [amount, setAmount] = useState(0);
  const [alternativeBloodTypes, setAlternativeBloodTypes] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    // Проверка наличия токена и роли пользователя (админ или нет)
    setIsAdmin(token && token.includes("admin"));
  }, []);

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      await userService.addUser({ username, password, role });
      alert("User added successfully!");
      setShowAddUserForm(false);
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
      setShowAddDonationForm(false);
      setBloodType("");
      setDonationDate("");
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

      setShowRequestBloodForm(false);
      setRequestBloodType("");
      setAmount(0);
      setAlternativeBloodTypes([]);
    } catch (error) {
      console.error("Failed to request blood:", error);
      alert("Failed to request blood");
    }
  };

  return (
    <div>
      <h1>Welcome to the Dashboard</h1>

      {isAdmin && (
        <>
          <button onClick={() => setShowAddUserForm(!showAddUserForm)}>
            {showAddUserForm ? "Close Form" : "Add User"}
          </button>
          {showAddUserForm && (
            <form onSubmit={handleAddUser}>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                required
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
              />
              <label>
                Admin:
                <input
                  type="checkbox"
                  checked={role.isAdmin}
                  onChange={(e) =>
                    setRole({ ...role, isAdmin: e.target.checked })
                  }
                />
              </label>
              <label>
                Regular User:
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
        </>
      )}

      <button onClick={() => setShowAddDonationForm(!showAddDonationForm)}>
        {showAddDonationForm ? "Close Form" : "Add Donation"}
      </button>
      {showAddDonationForm && (
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

      <button onClick={() => setShowRequestBloodForm(!showRequestBloodForm)}>
        {showRequestBloodForm ? "Close Form" : "Request Blood"}
      </button>
      {showRequestBloodForm && (
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
            required
          />
          <button type="submit">Request Blood</button>
        </form>
      )}
    </div>
  );
};

export default Dashboard;
