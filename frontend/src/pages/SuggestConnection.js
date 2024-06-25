import React from "react";
import { Typography, Container } from "@mui/material";
import ConnectionSuggestionForm from "../components/ConnectionSuggestionForm";

const SuggestConnection = () => {
  return (
    <Container maxWidth="sm" style={{ marginTop: "20px" }}>
      <Typography variant="h4" gutterBottom>
        Suggest Connection
      </Typography>
      <ConnectionSuggestionForm />
    </Container>
  );
};

export default SuggestConnection;
