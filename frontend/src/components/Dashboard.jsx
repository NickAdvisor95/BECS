import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import userService from "../services/userService";
import bloodService from "../services/bloodService";
import "./Dashboard.css"; // css
import Select from "react-select";

const Dashboard = () => {
  const [activeForm, setActiveForm] = useState(null);
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
  const [donationDate, setDonationDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [birthdayDonor, setBirthdayDonor] = useState("");
  const [donor_id, setDonorId] = useState("");
  const [donorFound, setDonorFound] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [donorFirstName, setDonorFirstName] = useState("");
  const [donorLastName, setDonorLastName] = useState("");
  const [donation_type, setDonationType] = useState("blood");

  const [requestBloodType, setRequestBloodType] = useState("");
  const [amount, setAmount] = useState(1);
  const [requestBloodTypeEmergency, setRequestBloodTypeEmergency] =
    useState("");
  const [amountEmergency, setAmountEmergency] = useState(1);
  const [alternativeBloodTypes, setAlternativeBloodTypes] = useState([]);

  const [medicalHistory, setMedicalHistory] = useState("");

  const navigate = useNavigate();

  const bloodTypeOptions = [
    { value: "O-", label: "O-" },
    { value: "O+", label: "O+" },
    { value: "A-", label: "A-" },
    { value: "A+", label: "A+" },
    { value: "B-", label: "B-" },
    { value: "B+", label: "B+" },
    { value: "AB-", label: "AB-" },
    { value: "AB+", label: "AB+" },
  ];

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

      // update last_donation_date
      await bloodService.updateLastDonationDate(donor_id);

      alert("Donation added successfully!");
      setActiveForm(null);
      setBloodType("");
      setDonorId("");
      setDonorFirstName("");
      setDonorLastName("");
      setDonationType("blood");
      setDonorFound(false);
    } catch (error) {
      alert("Failed to add donation");
    }
  };

  const handleDonorSearch = async () => {
    try {
      const response = await bloodService.getDonorById(donor_id);
      const donor = response.data;

      if (!donor) {
        setErrorMessage("Donor not found. Please register.");
        setDonorFound(false);
      } else {
        const lastDonationDate = new Date(donor.last_donation_date);
        const currentDate = new Date();
        const diffMonths =
          (currentDate - lastDonationDate) / (1000 * 60 * 60 * 24 * 30);

        if (donor.last_donation_date && diffMonths < 3) {
          setErrorMessage(
            "The donor cannot donate yet. 3 months haven't passed since the last donation."
          );
          setDonorFound(false);
        } else {
          setDonorFound(true);
          setDonorFirstName(donor.donorFirstName);
          setDonorLastName(donor.donorLastName);
          setBloodType(donor.bloodType);
          setErrorMessage("");
        }
      }
    } catch (error) {
      setErrorMessage("Error occurred while searching for the donor.");
      setDonorFound(false);
    }
  };

  const handleRegistrationDonor = async (e) => {
    e.preventDefault();

    const donorIdPattern = /^[0-9]{9}$/;

    if (!donorIdPattern.test(donor_id)) {
      alert("The donor id must be exactly 9 digits");
      return;
    }

    try {
      await bloodService.registrationDonation({
        donorFirstName,
        donorLastName,
        donor_id,
        bloodType,
        birthdayDonor,
        medicalHistory,
      });
      alert("The donor was registered successfully!");
      setActiveForm(null);
      setDonorFirstName("");
      setDonorLastName("");
      setDonorId("");
      setBloodType("");
      setBirthdayDonor("");
      setMedicalHistory("");
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        alert(error.response.data.message);
      } else {
        alert("Failed to register donor");
      }
    }
  };

  const handleRequestBlood = async (e) => {
    e.preventDefault();
    try {
      const response = await bloodService.requestBlood({
        bloodType: requestBloodType,
        amount,
      });

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
      setAmount(1);
      setAlternativeBloodTypes([]);
    } catch (error) {
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

      if (response.message === "Blood requested successfully in emergency") {
        alert("Blood requested successfully in emergency!");
      } else {
        alert(response.message || "Unknown error");
      }

      setActiveForm(null);
      setRequestBloodTypeEmergency("");
      setAmountEmergency(1);
    } catch (error) {
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
              <button
                onClick={() =>
                  setActiveForm(activeForm === "addUser" ? null : "addUser")
                }
                className={activeForm === "addUser" && "close-form"}
              >
                {activeForm === "addUser" ? "Close Form" : "Add User"}
              </button>
              <button onClick={handleDownloadLogs}>Download Logs</button>
            </>
          )}

          <button
            onClick={() =>
              setActiveForm(
                activeForm === "registerDonor" ? null : "registerDonor"
              )
            }
            className={activeForm === "registerDonor" && "close-form"}
          >
            {activeForm === "registerDonor"
              ? "Close Form"
              : "Donor Registration"}
          </button>

          <button
            onClick={() =>
              setActiveForm(
                activeForm === "addDonations" ? null : "addDonations"
              )
            }
            className={activeForm === "addDonations" && "close-form"}
          >
            {activeForm === "addDonations" ? "Close Form" : "Add Donation"}
          </button>

          <button
            onClick={() =>
              setActiveForm(
                activeForm === "requestBlood" ? null : "requestBlood"
              )
            }
            className={activeForm === "requestBlood" && "close-form"}
          >
            {activeForm === "requestBlood" ? "Close Form" : "Request Blood"}
          </button>

          <button
            onClick={() =>
              setActiveForm(
                activeForm === "requestBloodEmergency"
                  ? null
                  : "requestBloodEmergency"
              )
            }
            className={activeForm === "requestBloodEmergency" && "close-form"}
          >
            {activeForm === "requestBloodEmergency"
              ? "Close Form"
              : "Request Blood Emergency"}
          </button>
        </div>
      )}

      {activeForm === "addUser" && (
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
                setRole({
                  isAdmin: e.target.checked,
                  isRegularUser: false,
                  isResearchStudent: false,
                })
              }
            />
          </label>
          <label>
            Regular User:
            <input
              type="checkbox"
              checked={role.isRegularUser}
              onChange={(e) =>
                setRole({
                  isAdmin: false,
                  isRegularUser: e.target.checked,
                  isResearchStudent: false,
                })
              }
            />
          </label>
          <label>
            Research Student:
            <input
              type="checkbox"
              checked={role.isResearchStudent}
              onChange={(e) =>
                setRole({
                  isAdmin: false,
                  isRegularUser: false,
                  isResearchStudent: e.target.checked,
                })
              }
            />
          </label>
          <button type="submit">Create User</button>
        </form>
      )}

      {activeForm === "registerDonor" && (
        <form onSubmit={handleRegistrationDonor}>
          <input
            type="text"
            value={donorFirstName}
            onChange={(e) => setDonorFirstName(e.target.value)}
            placeholder="First name"
            required
          />
          <input
            type="text"
            value={donorLastName}
            onChange={(e) => setDonorLastName(e.target.value)}
            placeholder="Last name"
            required
          />
          <input
            type="text"
            value={donor_id}
            onChange={(e) => setDonorId(e.target.value)}
            placeholder="Passport ID"
            required
          />
          <Select
            options={bloodTypeOptions}
            value={bloodTypeOptions.find(
              (option) => option.value === bloodType
            )}
            onChange={(selectedOption) => setBloodType(selectedOption.value)}
            placeholder="Select blood type"
            isSearchable
            required
          />
          <label htmlFor="birthdayDonor">Birthday date</label>
          <input
            type="date"
            value={birthdayDonor}
            onChange={(e) => setBirthdayDonor(e.target.value)}
            placeholder="Birthday date"
            required
          />
          <input
            type="text"
            value={medicalHistory}
            onChange={(e) => setMedicalHistory(e.target.value)}
            placeholder="Medical history"
          />
          <button type="submit">Register Donor</button>
        </form>
      )}

      {activeForm === "addDonations" && (
        <form onSubmit={handleAddDonation}>
          <input
            type="text"
            value={donor_id}
            onChange={(e) => setDonorId(e.target.value)}
            placeholder="Donor ID"
            required
          />
          <button type="button" onClick={handleDonorSearch}>
            Search
          </button>
          {errorMessage && (
            <p className="error-message" style={{ color: "red" }}>
              {errorMessage}
            </p>
          )}
          {donorFound && (
            <>
              <input
                type="text"
                value={donorFirstName}
                readOnly
                placeholder="Donor First Name"
              />
              <input
                type="text"
                value={donorLastName}
                readOnly
                placeholder="Donor Last Name"
              />
              <input
                type="text"
                value={bloodType}
                readOnly
                placeholder="Blood Type"
              />
              <input
                type="date"
                value={donationDate}
                onChange={(e) => setDonationDate(e.target.value)}
                placeholder="Donation Date"
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
            </>
          )}
        </form>
      )}

      {activeForm === "requestBlood" && (
        <form onSubmit={handleRequestBlood}>
          <Select
            options={bloodTypeOptions}
            value={bloodTypeOptions.find(
                (option) => option.value === requestBloodType
            )}
            onChange={(selectedOption) => setRequestBloodType(selectedOption.value)}
            placeholder="Select blood type"
            isSearchable
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
          <Select
            options={bloodTypeOptions}
            value={bloodTypeOptions.find(
                (option) => option.value === requestBloodTypeEmergency
            )}
            onChange={(selectedOption) => setRequestBloodTypeEmergency(selectedOption.value)}
            placeholder="Select blood type"
            isSearchable
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
