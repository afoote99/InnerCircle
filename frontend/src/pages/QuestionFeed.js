import React, { useEffect, useState } from "react";
import { fetchQuestions } from "../services/api";
import AnswerForm from "../components/AnswerForm";
import { jwtDecode } from "jwt-decode";

const QuestionFeed = () => {
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const decodedToken = jwtDecode(token);
          const userId = decodedToken.userId;
          const questionsData = await fetchQuestions();
          const filteredQuestions = questionsData.filter((question) =>
            canUserSeeQuestion(question, userId)
          );
          setQuestions(filteredQuestions);
        } else {
          // Handle case when user is not logged in
          // Redirect to login page or display a message
        }
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    };

    fetchData();
  }, []);

  const canUserSeeQuestion = (question, userId) => {
    // Add your logic here to check if the user can see the question
    // For example, check if the user is in the inner circle or 2+ connections
    return true; // Replace with your actual logic
  };

  const handleAnswerSubmitted = (questionId) => {
    const fetchData = async () => {
      try {
        const questionsData = await fetchQuestions();
        const filteredQuestions = questionsData.filter((question) =>
          canUserSeeQuestion(
            question,
            jwtDecode(localStorage.getItem("token")).userId
          )
        );
        setQuestions(filteredQuestions);
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    };

    fetchData();
  };

  return (
    <div>
      <h2>Question Feed</h2>
      {questions.map((question) => (
        <div key={question.questionId}>
          <h3>{question.title}</h3>
          <p>{question.content}</p>
          <p>Category: {question.category}</p>
          <p>Asked by: {question.user.username}</p>
          <h4>Answers:</h4>
          {question.answers.map((answer) => (
            <div key={answer.answerId}>
              <p>{answer.content}</p>
              <p>Answered by: {answer.user.username}</p>
            </div>
          ))}
          <AnswerForm
            questionId={question.questionId}
            onAnswerSubmitted={() => handleAnswerSubmitted(question.questionId)}
          />
        </div>
      ))}
    </div>
  );
};

export default QuestionFeed;
