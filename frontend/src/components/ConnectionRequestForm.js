import React, { useState } from "react";
import { sendConnectionRequest } from "../services/api";
import { jwtDecode } from "jwt-decode";

const ConnectionRequestForm = () => {
  const [receiverUsername, setReceiverUsername] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (token) {
        const decodedToken = jwtDecode(token);
        const userId = decodedToken.userId;
        await sendConnectionRequest(userId, receiverUsername);
        setReceiverUsername("");
        // Show success message or handle the response as needed
      } else {
        // Handle case when user is not logged in
        // Redirect to login page or display a message
      }
    } catch (error) {
      console.error("Error sending connection request:", error);
      // Show error message to the user
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Receiver Username"
        value={receiverUsername}
        onChange={(e) => setReceiverUsername(e.target.value)}
        required
      />
      <button type="submit">Send Request</button>
    </form>
  );
};

export default ConnectionRequestForm;
