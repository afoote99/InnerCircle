import React, { useState } from "react";
import { answerQuestion } from "../services/api";

const AnswerForm = ({ questionId, onAnswerSubmitted }) => {
  const [content, setContent] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // TODO: Get the logged-in user's ID (you can store it in the application state after login)
      const userId = 1; // Hardcoded for now
      await answerQuestion(questionId, { content, userId });
      setContent("");
      onAnswerSubmitted();
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
