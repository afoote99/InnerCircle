import React, { useState, useEffect } from "react";
import {
  Typography,
  List,
  ListItem,
  ListItemText,
  Button,
  Container,
} from "@mui/material";
import {
  fetchUserNetwork,
  acceptConnectionRequest,
  declineConnectionRequest,
} from "../services/api";
import { jwtDecode } from "jwt-decode";

const Notifications = () => {
  const [receivedRequests, setReceivedRequests] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const decodedToken = jwtDecode(token);
          const userId = decodedToken.userId;
          const networkData = await fetchUserNetwork(userId);
          setReceivedRequests(networkData.receivedRequests || []);
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
        // Update the received requests
        const networkData = await fetchUserNetwork(userId);
        setReceivedRequests(networkData.receivedRequests);
      }
    } catch (error) {
      console.error("Error accepting connection request:", error);
    }
  };

  const handleDeclineRequest = async (requestId) => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        const decodedToken = jwtDecode(token);
        const userId = decodedToken.userId;
        await declineConnectionRequest(userId, requestId);
        // Update the received requests
        const networkData = await fetchUserNetwork(userId);
        setReceivedRequests(networkData.receivedRequests);
      }
    } catch (error) {
      console.error("Error declining connection request:", error);
    }
  };

  return (
    <Container maxWidth="md" style={{ marginTop: "20px" }}>
      <Typography variant="h4" gutterBottom>
        Notifications
      </Typography>
      <List>
        {receivedRequests.map((request) => (
          <ListItem key={request.requestId}>
            <ListItemText
              primary={
                request.suggester
                  ? `${request.suggester.username} suggests ${request.sender.username} to connect with you`
                  : `Connection request from ${request.sender.username}`
              }
              secondary={request.note}
            />
            <Button
              onClick={() => handleAcceptRequest(request.requestId)}
              color="primary"
            >
              Accept
            </Button>
            <Button
              onClick={() => handleDeclineRequest(request.requestId)}
              color="secondary"
            >
              Decline
            </Button>
          </ListItem>
        ))}
      </List>
    </Container>
  );
};

export default Notifications;
