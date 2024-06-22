import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Card,
  CardContent,
  Typography,
  Container,
  TextField,
  Button,
} from "@mui/material";
import { fetchQuestionById, answerQuestion } from "../services/api";

const QuestionDetail = () => {
  const { questionId } = useParams();
  const [question, setQuestion] = useState(null);
  const [newAnswer, setNewAnswer] = useState("");
  const [answers, setAnswers] = useState([]);

  useEffect(() => {
    const loadQuestion = async () => {
      const fetchedQuestion = await fetchQuestionById(questionId);
      if (fetchedQuestion) {
        setQuestion(fetchedQuestion);
        setAnswers(fetchedQuestion.answers || []);
      }
    };

    loadQuestion();
  }, [questionId]);

  const handleAddAnswer = async () => {
    try {
      const userId = localStorage.getItem("userId"); // Make sure this retrieves the correct user ID
      const answerData = {
        content: newAnswer,
        userId, // Include this in the data sent to the backend
      };
      const newAnswerResponse = await answerQuestion(
        question.questionId,
        answerData
      );
      if (newAnswerResponse) {
        setAnswers((prevAnswers) => [...prevAnswers, newAnswerResponse]); // Append the new answer
        setNewAnswer(""); // Clear the input after posting
      }
    } catch (error) {
      console.error("Error posting answer:", error);
    }
  };

  if (!question) {
    return <div>Loading question...</div>;
  }

  return (
    <Container maxWidth="md">
      <Card variant="outlined">
        <CardContent>
          <Typography variant="h5">{question.title}</Typography>
          <Typography variant="body1">{question.content}</Typography>
          <Typography variant="body2" color="textSecondary">
            Asked by: {question.user?.username}
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
      <Typography variant="h6" style={{ margin: "20px 0" }}>
        Replies:
      </Typography>
      {answers.map((answer, index) => (
        <Card key={index} variant="outlined" style={{ marginTop: "10px" }}>
          <CardContent>
            <Typography variant="body1">{answer.content}</Typography>
            <Typography variant="body2" color="textSecondary">
              Answered by: {answer.user?.username || "Anonymous"}
            </Typography>
          </CardContent>
        </Card>
      ))}
    </Container>
  );
};

export default QuestionDetail;
