import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Container,
  TextField,
  Button,
} from "@mui/material";

const QuestionDetail = ({ question }) => {
  const [newAnswer, setNewAnswer] = React.useState("");
  const [answers, setAnswers] = React.useState(question.answers || []);

  const handleAddAnswer = async () => {
    try {
      const response = await fetch(
        `/api/questions/${question.questionId}/answer`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            content: newAnswer,
            userId: localStorage.getItem("userId"),
          }),
        }
      );
      const data = await response.json();
      if (response.ok) {
        setAnswers([...answers, data]);
        setNewAnswer("");
      } else {
        throw new Error(data.message);
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
            Asked by: {question.user.username}
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
              Answered by: {answer.user.username}
            </Typography>
          </CardContent>
        </Card>
      ))}
    </Container>
  );
};

export default QuestionDetail;
