import React from "react";
import { AppBar, Toolbar, IconButton, InputBase, Box } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import NotificationsIcon from "@mui/icons-material/Notifications";
import PersonIcon from "@mui/icons-material/Person";
import SearchIcon from "@mui/icons-material/Search";
import HubIcon from "@mui/icons-material/Hub";
import { useNavigate } from "react-router-dom";
import { styled } from "@mui/material/styles";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: "#F1F1F1",
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(1),
    width: "auto",
  },
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
}));

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <AppBar
      position="fixed"
      style={{ background: "#FFFFFF", color: "#717C87", zIndex: 1100 }}
    >
      <Toolbar>
        <IconButton onClick={() => navigate("/questions")} color="inherit">
          <HomeIcon />
        </IconButton>
        <Search>
          <IconButton type="submit" color="inherit">
            <SearchIcon />
          </IconButton>
          <StyledInputBase
            placeholder="Search…"
            inputProps={{ "aria-label": "search" }}
          />
        </Search>
        <Box sx={{ flexGrow: 1 }} />
        <IconButton onClick={() => navigate("/network")} color="inherit">
          <HubIcon />
        </IconButton>
        <IconButton onClick={() => navigate("/notifications")} color="inherit">
          <NotificationsIcon />
        </IconButton>
        <IconButton onClick={() => navigate("/profile")} color="inherit">
          <PersonIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
