import React, { useState } from "react";
import { answerQuestion } from "../services/api";
import { jwtDecode } from "jwt-decode";

const AnswerForm = ({ questionId, onAnswerSubmitted }) => {
  const [content, setContent] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (token) {
        const decodedToken = jwtDecode(token);
        const userId = decodedToken.userId;
        await answerQuestion(questionId, { content, userId });
        setContent("");
        onAnswerSubmitted();
      } else {
        // Handle case when user is not logged in
        // Redirect to login page or display a message
      }
    } catch (error) {
      console.error("Error answering question:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Your Answer:</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
      </div>
      <button type="submit">Submit Answer</button>
    </form>
  );
};

export default AnswerForm;
