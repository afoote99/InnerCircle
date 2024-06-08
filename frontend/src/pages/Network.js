import React, { useEffect, useState } from "react";
import {
  fetchUserNetwork,
  acceptConnectionRequest,
  declineConnectionRequest,
} from "../services/api";
import moment from "moment";
import { jwtDecode } from "jwt-decode";
import ConnectionRequestForm from "../components/ConnectionRequestForm";
import ConnectionSuggestionForm from "../components/ConnectionSuggestionForm";

const Network = () => {
  const [network, setNetwork] = useState([]);
  const [receivedRequests, setReceivedRequests] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const decodedToken = jwtDecode(token);
          const userId = decodedToken.userId;
          const networkData = await fetchUserNetwork(userId);
          setNetwork(networkData.connections || []);
          setReceivedRequests(networkData.receivedRequests || []);
        } else {
          // Handle case when user is not logged in
          // Redirect to login page or display a message
        }
      } catch (error) {
        console.error("Error fetching user network:", error);
      }
    };

    fetchData();
  }, []);

  const handleAcceptRequest = async (requestId) => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        const decodedToken = jwtDecode(token);
        const userId = decodedToken.userId;
        await acceptConnectionRequest(userId, requestId);
        // Update the network and received requests data
        const networkData = await fetchUserNetwork(userId);
        setNetwork(networkData.connections);
        setReceivedRequests(networkData.receivedRequests);
      } else {
        // Handle case when user is not logged in
        // Redirect to login page or display a message
      }
    } catch (error) {
      console.error("Error accepting connection request:", error);
      // Show error message to the user
    }
  };

  const handleDeclineRequest = async (requestId) => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        const decodedToken = jwtDecode(token);
        const userId = decodedToken.userId;
        await declineConnectionRequest(userId, requestId);
        // Update the received requests data
        const networkData = await fetchUserNetwork(userId);
        setReceivedRequests(networkData.receivedRequests);
      } else {
        // Handle case when user is not logged in
        // Redirect to login page or display a message
      }
    } catch (error) {
      console.error("Error declining connection request:", error);
      // Show error message to the user
    }
  };

  return (
    <div>
      <h2>My Network</h2>
      <h3>Connections</h3>
      {network &&
        network.map((connection) => (
          <div key={connection.connectionId}>
            <p>
              {connection.user1?.username} - {connection.user2?.username}
            </p>
            <p>
              Connected since:{" "}
              {moment(connection.connected_since).format("MM/DD/YYYY")}
            </p>
          </div>
        ))}
      <h3>Received Requests</h3>
      {receivedRequests &&
        receivedRequests.map((request) => (
          <div key={request.requestId}>
            <p>From: {request.sender.username}</p>
            <p>Note: {request.note}</p> {/* Display the note */}
            <button onClick={() => handleAcceptRequest(request.requestId)}>
              Accept
            </button>
            <button onClick={() => handleDeclineRequest(request.requestId)}>
              Decline
            </button>
          </div>
        ))}
      <h3>Send Connection Request</h3>
      <ConnectionRequestForm />
      <h3>Suggest Connection</h3>
      <ConnectionSuggestionForm />
    </div>
  );
};

export default Network;
