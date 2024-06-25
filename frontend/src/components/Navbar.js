import React from "react";
import { AppBar, Toolbar, Button, Badge } from "@mui/material";
import { useNavigate } from "react-router-dom";
import NotificationsIcon from "@mui/icons-material/Notifications";

const Navbar = ({ notificationCount }) => {
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
        <Button color="inherit" onClick={() => navigate("/notifications")}>
          <Badge badgeContent={notificationCount} color="secondary">
            <NotificationsIcon />
          </Badge>
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
