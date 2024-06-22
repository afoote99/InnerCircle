import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchQuestions } from "../services/api";
import { jwtDecode } from "jwt-decode";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Container,
  Grid,
  Chip,
} from "@mui/material";

const QuestionFeed = () => {
  const [questions, setQuestions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        const decodedToken = jwtDecode(token);
        const userId = decodedToken.userId;
        const questionsData = await fetchQuestions(userId);
        setQuestions(questionsData);
      } else {
        navigate("/login");
      }
    };

    fetchData();
  }, [navigate]);

  return (
    <Container
      maxWidth="lg"
      style={{
        backgroundColor: "#FCFBF4",
        paddingTop: "64px",
        paddingBottom: "20px",
        maxWidth: "100%",
      }}
    >
      <div
        style={{
          position: "fixed",
          top: "64px",
          left: 0,
          right: 0,
          zIndex: 100,
          backgroundColor: "#FCFBF4",
          borderBottom: "2px solid #71490D",
          padding: "0 20px",
        }}
      >
        <Container
          maxWidth="lg"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "10px 0",
          }}
        >
          <Typography variant="h6" style={{ color: "#71490D" }}>
            Feed View | Map View
          </Typography>
          <Button
            variant="contained"
            style={{ backgroundColor: "#71490D", color: "#FCFBF4" }}
            onClick={() => navigate("/questions/create")}
          >
            + Create
          </Button>
        </Container>
      </div>
      <Grid container spacing={2} style={{ paddingTop: "100px" }}>
        {" "}
        {/* Adjusted the padding to reduce space */}
        {questions.map((question) => (
          <Grid item xs={12} key={question.questionId}>
            <Card
              style={{
                padding: "10px",
                margin: "10px 0",
                backgroundColor: "#F1F1F1",
              }}
              onClick={() => navigate(`/questions/${question.questionId}`)} // Making posts clickable
            >
              <CardContent>
                <Typography variant="h6" style={{ color: "#71490D" }}>
                  {question.title}
                </Typography>
                <Typography variant="body1" style={{ color: "#717C87" }}>
                  {question.content}
                </Typography>
                <Chip
                  label="Tag"
                  style={{ backgroundColor: "#D9D9D9", color: "#8F8F8F" }}
                />
                <Typography
                  variant="body2"
                  color="textSecondary"
                  style={{ marginTop: "5px" }}
                >
                  {question.isAnonymous ? "Anonymous" : question.user.username}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default QuestionFeed;
