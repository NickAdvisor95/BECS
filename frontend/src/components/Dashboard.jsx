import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import userService from "../services/userService";
import bloodService from "../services/bloodService";
import "./Dashboard.css"; // css
import Select from "react-select";
import Joyride from 'react-joyride';
import infoIcon from '../assets/info.png';
import BloodInventory from './BloodInventory';

const Dashboard = () => {
  const [activeForm, setActiveForm] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isResearchStudent, setIsResearchStudent] = useState(false);
  const [isRegularUser, setIsRegularUser] = useState(false);
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
  const [isTutorialActive, setIsTutorialActive] = useState(true);
  const [isTutorialCompleted, setIsTutorialCompleted] = useState(false);

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
    setIsRegularUser(role === "regular_user");

    fetchBloodInventory();
  }, []);

  useEffect(() => {
    if (!isTutorialCompleted) {
      setIsTutorialActive(true);
    }
  }, [isTutorialCompleted]);

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

  const handleTutorialCallback = (data) => {
    const { status } = data;

    if (status === 'finished' || status === 'skipped') {
      setIsTutorialActive(false);
      setIsTutorialCompleted(true);
    } else if (status === 'running') {
      setIsTutorialCompleted(false);
    }
  };

  const [steps, setSteps] = useState([
    {
      target: "h1",
      content: "Welcome! Please spare a minute to learn about the functionality. You can skip the tutorial at any time.",
      roles: ['admin', 'student', 'user']
    },
    {
      target: "#info-button",
      content: "If you want to see the tutorial again, you can click here or at the green point if you see one!",
      roles: ['admin', 'student', 'user']
    },
    {
      target: "#add-user",
      content: "Here you can register a new user! Once the name is entered, choose the user's role (Admin / Regular User / Research Student).",
      roles: ['admin']
    },
    {
      target: "#donor-registration",
      content: "Here you can register a new donor! The \"Medical history\" field is optional :) Don't forget to enter the donor's birthdate.",
      roles: ['admin', 'user']
    },
    {
      target: "#add-donation",
      content: "Click here to add a new donation! Firstly find the donor in the system, if not found, then register one! After all choose the donation type (Blood / Plasma) and that's it!",
      roles: ['admin', 'user']
    },
    {
      target: "#request-blood",
      content: "Need a blood from an inventory? Just request one! Choose the blood type you need and take it if exists. Otherwise take an alternative.",
      roles: ['admin', 'user']
    },
    {
      target: "#request-blood-er",
      content: "You are free to request amount of blood for your emergency!",
      roles: ['admin', 'user']
    },
    {
      target: "#blood-inventory",
      content: "Here in the table you can find the blood inventory. Available blood types and their amount.",
      roles: ['admin', 'user']
    },
    {
      target: ".std",
      content: "Here in the table you can find our blood inventory. Research it in your time!",
      roles: ['student']
    },
    {
      target: "#download-logs",
      content: "Here you can download audit logs for actions made here. The document will be in pdf format.",
      roles: ['admin']
    },
  ]);

  const getStepsByUserType = (userType) => {
    return steps.filter(item => item.roles.includes(userType));
  };

  const stepsForStudent = [
    {
      target: "h1",
      content: "Welcome! Please spare a minute to learn about the functionality. You can skip the tutorial at any time.",
    },
    {
      target: "#info-button",
      content: "If you want to see the tutorial again, you can click here or at the green point if you see one!"
    },
    {
      target: "#blood-inventory",
      content: "Here in the table you can find our blood inventory. Research it in your time!"
    },
  ];

  return (
      <div className="dashboard-container">
        <Joyride
            steps={isAdmin ? getStepsByUserType('admin') : isResearchStudent ? getStepsByUserType('student') : getStepsByUserType('user')}
            continuous={true}
            showProgress={true}
            showSkipButton={true}
            callback={handleTutorialCallback}
            run={isTutorialActive}
            styles={{
              options: {
                primaryColor: "#20A200AA",
              },
              spotlightShadow: "0 0 15px rgba(0, 0, 0, 0.5)",
            }}
        />
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'auto auto',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <h1>Welcome to the Dashboard</h1>
          <button
              id="info-button"
              style={{
                width: '40px',
                height: '40px',
                border: 'none',
                margin: '10px',
                cursor: isTutorialCompleted ? 'pointer' : 'unset',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: isTutorialCompleted ? '#20A200AA' : '#a4a4a4'
              }}
              onClick={() => {
                if (isTutorialCompleted) {
                  setIsTutorialActive(true);
                  setSteps((prevSteps) => {
                    const updatedSteps = [...prevSteps];
                    updatedSteps[0].disableBeacon = true;
                    return updatedSteps;
                  });
                }
              }}>
              <img src={infoIcon} width="30px" height="30px" alt="Info"/>
          </button>
        </div>

        {isResearchStudent ? (
            <BloodInventory title="Blood Inventory for Research" bloodInventory={bloodInventory} />
        ) : (
            <div className="dashboard-buttons">
              {isAdmin && (
                  <>
                    <button id="add-user"
                            onClick={() =>
                                setActiveForm(activeForm === "addUser" ? null : "addUser")
                            }
                            className={activeForm === "addUser" && "close-form"}
                    >
                      {activeForm === "addUser" ? "Close Form" : "Add User"}
                    </button>
                  </>
              )}

              <button id="donor-registration"
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

              <button id="add-donation"
                      onClick={() =>
                          setActiveForm(
                              activeForm === "addDonations" ? null : "addDonations"
                          )
                      }
                      className={activeForm === "addDonations" && "close-form"}
              >
                {activeForm === "addDonations" ? "Close Form" : "Add Donation"}
              </button>

              <button id="request-blood"
                      onClick={() =>
                          setActiveForm(
                              activeForm === "requestBlood" ? null : "requestBlood"
                          )
                      }
                      className={activeForm === "requestBlood" && "close-form"}
              >
                {activeForm === "requestBlood" ? "Close Form" : "Request Blood"}
              </button>

              <button id="request-blood-er"
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

              <button id="blood-inventory"
                      onClick={() =>
                          setActiveForm(
                              activeForm === "bloodInventory"
                                  ? null
                                  : "bloodInventory"
                          )
                      }
                      className={activeForm === "bloodInventory" && "close-form"}
              >
                {activeForm === "bloodInventory"
                    ? "Close Form"
                    : "Show Blood Inventory"}
              </button>

              { isAdmin && <button id="download-logs"
                       onClick={handleDownloadLogs}>Download Logs
                </button>
              }
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
                  <p className="error-message" style={{color: "red"}}>
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

        {activeForm === "bloodInventory" && (
            <BloodInventory title="Blood Inventory" bloodInventory={bloodInventory} />
        )}
      </div>
  );
};

export default Dashboard;
