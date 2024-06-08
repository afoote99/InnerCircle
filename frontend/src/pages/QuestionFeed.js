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
          const questionsData = await fetchQuestions(userId); // Pass the userId to the API
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
    // Check if the user is the author of the question or connected to the question author
    const isAuthor = question.user.userId === userId;
    const isConnected =
      question.user.connections &&
      question.user.connections.some(
        (connection) =>
          connection.user1.userId === userId ||
          connection.user2.userId === userId
      );

    return isAuthor || isConnected;
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
          <p>
            Asked by:{" "}
            {question.isAnonymous ? "Anonymous" : question.user.username}
          </p>
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
