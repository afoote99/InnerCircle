import React from "react";
import { Typography, Container } from "@mui/material";
import ConnectionRequestForm from "../components/ConnectionRequestForm";

const AddConnection = () => {
  return (
    <Container maxWidth="sm" style={{ marginTop: "20px" }}>
      <Typography variant="h4" gutterBottom>
        Add Connection
      </Typography>
      <ConnectionRequestForm />
    </Container>
  );
};

export default AddConnection;
