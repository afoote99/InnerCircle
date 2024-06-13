import React from "react";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <AppBar position="static">
      <Toolbar>
        <Button color="inherit" onClick={() => navigate("/questions")}>
          Home
        </Button>
        <Button color="inherit" onClick={() => navigate("/network")}>
          Connections
        </Button>
        <Button color="inherit" onClick={() => navigate("/profile")}>
          Profile
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
