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
    <Container maxWidth="md">
      <Typography variant="h4" gutterBottom>
        Question Feed
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={() => navigate("/questions/create")}
      >
        Make a Post
      </Button>
      <Grid container spacing={2} style={{ marginTop: "20px" }}>
        {questions.map((question) => (
          <Grid item xs={12} md={6} key={question.questionId}>
            <Card onClick={() => navigate(`/questions/${question.questionId}`)}>
              <CardContent>
                <Typography variant="h5">{question.title}</Typography>
                <Typography variant="body2">{question.content}</Typography>
                <Typography variant="body2" color="textSecondary">
                  Asked by:{" "}
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
