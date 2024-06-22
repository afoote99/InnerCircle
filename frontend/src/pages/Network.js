import React, { useEffect, useState } from "react";
import {
  fetchUserNetwork,
  acceptConnectionRequest,
  declineConnectionRequest,
  sendConnectionRequest,
  suggestConnection,
} from "../services/api";
import { jwtDecode } from "jwt-decode";
import {
  Box,
  Container,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  TextField,
  Button,
  Grid,
} from "@mui/material";
import moment from "moment";

const Network = () => {
  const [network, setNetwork] = useState([]);
  const [receivedRequests, setReceivedRequests] = useState([]);
  const [receiverUsername, setReceiverUsername] = useState("");
  const [user1, setUser1] = useState("");
  const [user2, setUser2] = useState("");
  const [note, setNote] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        const decodedToken = jwtDecode(token);
        const userId = decodedToken.userId;
        const networkData = await fetchUserNetwork(userId);
        setNetwork(networkData.connections || []);
        setReceivedRequests(networkData.receivedRequests || []);
      } else {
        console.error("User is not logged in");
      }
    };

    fetchData();
  }, []);

  const handleSendRequest = async () => {
    const token = localStorage.getItem("token");
    if (!token) return; // Ensure there is a token
    const decodedToken = jwtDecode(token);
    const userId = decodedToken.userId;
    try {
      await sendConnectionRequest(userId, receiverUsername, note);
      // Optionally fetch and update the list of connections
      const updatedNetwork = await fetchUserNetwork(userId);
      setNetwork(updatedNetwork.connections || []);
    } catch (error) {
      console.error("Error sending connection request:", error);
    }
  };

  const handleSuggestConnection = async () => {
    const token = localStorage.getItem("token");
    if (!token) return; // Ensure there is a token
    const decodedToken = jwtDecode(token);
    const userId = decodedToken.userId;
    try {
      await suggestConnection(userId, user1, user2, note);
      // Optionally fetch and update the list of connections
      const updatedNetwork = await fetchUserNetwork(userId);
      setNetwork(updatedNetwork.connections || []);
    } catch (error) {
      console.error("Error suggesting connection:", error);
    }
  };

  return (
    <Container
      maxWidth="xl"
      style={{ paddingTop: "100px", backgroundColor: "#FCFBF4" }}
    >
      <Box
        sx={{ display: "flex", justifyContent: "space-between", padding: 2 }}
      >
        <Box sx={{ width: "25%", textAlign: "center", marginRight: 2 }}>
          {/* Connection Request Form */}
          <TextField
            label="Receiver Username"
            variant="outlined"
            size="small"
            value={receiverUsername}
            onChange={(e) => setReceiverUsername(e.target.value)}
            fullWidth
          />
          <Button
            onClick={handleSendRequest}
            variant="contained"
            sx={{ mt: 2 }}
          >
            Send Request
          </Button>

          {/* Connection Suggestion Form */}
          <TextField
            label="User 1 Username"
            variant="outlined"
            size="small"
            value={user1}
            onChange={(e) => setUser1(e.target.value)}
            fullWidth
            sx={{ mt: 2 }}
          />
          <TextField
            label="User 2 Username"
            variant="outlined"
            size="small"
            value={user2}
            onChange={(e) => setUser2(e.target.value)}
            fullWidth
            sx={{ mt: 2 }}
          />
          <TextField
            label="Note"
            variant="outlined"
            size="small"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            fullWidth
            sx={{ mt: 2 }}
          />
          <Button
            onClick={handleSuggestConnection}
            variant="contained"
            sx={{ mt: 2 }}
          >
            Suggest Connection
          </Button>
        </Box>
        <Box sx={{ width: "50%", overflowY: "auto", maxHeight: 500 }}>
          <Typography variant="h6">{`${network.length} Connections`}</Typography>
          <List>
            {network.map((connection) => (
              <ListItem button key={connection.connectionId}>
                <ListItemText
                  primary={`${connection.user1?.username || "Unknown"} - ${
                    connection.user2?.username || "Unknown"
                  }`}
                />
                <Typography variant="body2">
                  Connected since:{" "}
                  {moment(connection.connected_since).format("MM/DD/YYYY")}
                </Typography>
              </ListItem>
            ))}
          </List>
        </Box>
        <Box sx={{ width: "25%", textAlign: "center" }}>
          <Typography variant="h6">Connection Tree</Typography>
          <Typography>Select a connection to see how you're linked</Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default Network;
