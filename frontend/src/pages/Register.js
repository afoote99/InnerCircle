import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../services/api";
import {
  Button,
  TextField,
  Typography,
  Container,
  Box,
  Link,
  Grid,
  MenuItem,
  FormControl,
  Select,
  InputLabel,
} from "@mui/material";

const Register = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [birthMonth, setBirthMonth] = useState("");
  const [birthDay, setBirthDay] = useState("");
  const [birthYear, setBirthYear] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await registerUser({
        firstName,
        lastName,
        email,
        password,
        birthMonth,
        birthDay,
        birthYear,
      });
      navigate("/login");
    } catch (error) {
      console.error("Error registering user:", error);
    }
  };

  return (
    <Container
      component="main"
      maxWidth="sm"
      sx={{ padding: "20px", backgroundColor: "#FCFBF4" }}
    >
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography component="h1" variant="h5" style={{ color: "#717C87" }}>
          Create a new account
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="firstName"
                label="First name"
                name="firstName"
                autoComplete="fname"
                autoFocus
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                sx={{ backgroundColor: "#FCFBF4" }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="lastName"
                label="Last name"
                name="lastName"
                autoComplete="lname"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                sx={{ backgroundColor: "#FCFBF4" }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                sx={{ backgroundColor: "#FCFBF4" }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                sx={{ backgroundColor: "#FCFBF4" }}
              />
            </Grid>
            <Grid item xs={4}>
              <FormControl fullWidth>
                <InputLabel id="month-label">Month</InputLabel>
                <Select
                  labelId="month-label"
                  id="month-select"
                  value={birthMonth}
                  label="Month"
                  onChange={(e) => setBirthMonth(e.target.value)}
                  sx={{ backgroundColor: "#FCFBF4" }}
                >
                  {/* Map through months here */}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={4}>
              <FormControl fullWidth>
                <InputLabel id="day-label">Day</InputLabel>
                <Select
                  labelId="day-label"
                  id="day-select"
                  value={birthDay}
                  label="Day"
                  onChange={(e) => setBirthDay(e.target.value)}
                  sx={{ backgroundColor: "#FCFBF4" }}
                >
                  {/* Map through days here */}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={4}>
              <FormControl fullWidth>
                <InputLabel id="year-label">Year</InputLabel>
                <Select
                  labelId="year-label"
                  id="year-select"
                  value={birthYear}
                  label="Year"
                  onChange={(e) => setBirthYear(e.target.value)}
                  sx={{ backgroundColor: "#FCFBF4" }}
                >
                  {/* Map through years here */}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2, backgroundColor: "#71490D" }}
          >
            Sign up
          </Button>
          <Typography variant="body2" color="text.secondary" align="center">
            Don't have an account?{" "}
            <Typography
              component="a"
              href="/login"
              variant="body2"
              color="primary"
              style={{ textDecoration: "none" }}
            >
              Sign up
            </Typography>
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default Register;
