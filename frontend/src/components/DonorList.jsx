import { useEffect, useState } from "react";
import donorService from "../services/donorService";

const DonorList = () => {
  const [donors, setDonors] = useState([]);

  useEffect(() => {
    const fetchDonors = async () => {
      const response = await donorService.getDonors();
      setDonors(response.data);
    };

    fetchDonors();
  }, []);

  return (
    <div>
      <h2>Donor List</h2>
      <ul>
        {donors.map((donor) => (
          <li key={donor.id}>
            {donor.firstName} {donor.lastName} - {donor.blood_type}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DonorList;
