import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Card,
  CardContent,
  Typography,
  Container,
  TextField,
  Button,
  CircularProgress,
} from "@mui/material";
import { fetchQuestionById, answerQuestion } from "../services/api";
import { jwtDecode } from "jwt-decode";

const QuestionDetail = () => {
  const [question, setQuestion] = useState(null);
  const [newAnswer, setNewAnswer] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { questionId } = useParams();

  const loadQuestion = async () => {
    try {
      const data = await fetchQuestionById(questionId);
      setQuestion(data);
      setLoading(false);
    } catch (err) {
      setError("Failed to load question");
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQuestion();
  }, [questionId]);

  const handleAddAnswer = async () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        const decodedToken = jwtDecode(token);
        const userId = decodedToken.userId;
        const response = await answerQuestion(questionId, {
          content: newAnswer,
          userId,
        });

        if (response && response.answerId) {
          // Reload the question to get the updated answers
          await loadQuestion();
          setNewAnswer("");
        } else {
          console.error("Unexpected response structure:", response);
          setError("Failed to post answer. Please try again.");
        }
      }
    } catch (error) {
      console.error("Error posting answer:", error);
      setError("Failed to post answer. Please try again.");
    }
  };

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;
  if (!question) return <Typography>Question not found</Typography>;

  return (
    <Container maxWidth="md">
      <Card variant="outlined">
        <CardContent>
          <Typography variant="h5">{question.title}</Typography>
          <Typography variant="body1">{question.content}</Typography>
          <Typography variant="body2" color="textSecondary">
            Asked by: {question.user?.username || "Unknown"}
          </Typography>
        </CardContent>
      </Card>
      <TextField
        fullWidth
        label="Your Answer"
        multiline
        rows={4}
        value={newAnswer}
        onChange={(e) => setNewAnswer(e.target.value)}
        variant="outlined"
        margin="normal"
      />
      <Button variant="contained" color="primary" onClick={handleAddAnswer}>
        Post Reply
      </Button>
      {error && <Typography color="error">{error}</Typography>}
      <Typography variant="h6" style={{ margin: "20px 0" }}>
        Replies:
      </Typography>
      {question.answers && question.answers.length > 0 ? (
        question.answers.map((answer) => (
          <Card
            key={answer.answerId}
            variant="outlined"
            style={{ marginTop: "10px" }}
          >
            <CardContent>
              <Typography variant="body1">{answer.content}</Typography>
              <Typography variant="body2" color="textSecondary">
                Answered by: {answer.user?.username || "Unknown"}
              </Typography>
            </CardContent>
          </Card>
        ))
      ) : (
        <Typography>No answers yet.</Typography>
      )}
    </Container>
  );
};

export default QuestionDetail;
