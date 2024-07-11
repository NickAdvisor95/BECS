import React, { useState } from "react";
import notificationService from "../services/notificationService";

const NotifyDonor = () => {
  const [donor_id, setDonorId] = useState("");
  const [message, setMessage] = useState("");

  const handleSendNotification = async () => {
    try {
      await notificationService.sendNotification(donor_id, message);
      alert("Notification sent successfully!");
    } catch (error) {
      alert("Error sending notification");
      console.error("Error sending notification:", error);
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Donor ID"
        value={donor_id}
        onChange={(e) => setDonorId(e.target.value)}
      />
      <textarea
        placeholder="Message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button onClick={handleSendNotification}>Send Notification</button>
    </div>
  );
};

export default NotifyDonor;
