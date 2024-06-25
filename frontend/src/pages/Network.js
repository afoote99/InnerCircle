import React, { useState, useEffect } from "react";
import { fetchUserNetwork } from "../services/api";
import { jwtDecode } from "jwt-decode";
import {
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  Dialog,
  DialogContent,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import ConnectionTree from "../components/ConnectionTree";

const Network = () => {
  const [network, setNetwork] = useState([]);
  const [selectedConnection, setSelectedConnection] = useState(null);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const decodedToken = jwtDecode(token);
          const userId = decodedToken.userId;
          setCurrentUserId(userId);
          const networkData = await fetchUserNetwork(userId);
          setNetwork(networkData.connections || []);
        } else {
          navigate("/login");
        }
      } catch (error) {
        console.error("Error fetching user network:", error);
      }
    };

    fetchData();
  }, [navigate]);

  const handleConnectionClick = (connection) => {
    console.log("Clicked connection:", connection);

    const targetId =
      connection.user1.userId === currentUserId
        ? connection.user2.userId
        : connection.user1.userId;

    if (targetId) {
      setSelectedConnection({ ...connection, targetId });
      setOpen(true);
    } else {
      console.error("Target user ID is undefined", connection);
      // You might want to show an error message to the user here
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div style={{ padding: "20px" }}>
      <Typography variant="h4" gutterBottom>
        My Network
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={() => navigate("/add-connection")}
        style={{ marginRight: "10px" }}
      >
        Add Connection
      </Button>
      <Button
        variant="contained"
        color="secondary"
        onClick={() => navigate("/suggest-connection")}
      >
        Suggest Connection
      </Button>
      <List>
        {network.map((connection) => {
          const otherUser =
            connection.user1.userId === currentUserId
              ? connection.user2
              : connection.user1;
          return (
            <ListItem
              button
              key={connection.connectionId}
              onClick={() => handleConnectionClick(connection)}
            >
              <ListItemText primary={otherUser.username} />
            </ListItem>
          );
        })}
      </List>
      <Dialog open={open} onClose={handleClose}>
        <DialogContent>
          {selectedConnection && (
            <ConnectionTree
              userId={currentUserId}
              targetId={selectedConnection.targetId}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Network;
