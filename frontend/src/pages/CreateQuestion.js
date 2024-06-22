import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createQuestion } from "../services/api";
import { jwtDecode } from "jwt-decode";

const CreateQuestion = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [scope, setScope] = useState("all");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (token) {
        const decodedToken = jwtDecode(token);
        const userId = decodedToken.userId;
        await createQuestion({
          title,
          content,
          category,
          userId: parseInt(userId), // Ensure it's an integer
          scope,
        });
        navigate("/questions");
      } else {
        // Handle case when user is not logged in
      }
    } catch (error) {
      console.error("Error creating question:", error);
    }
  };

  return (
    <div>
      <h2>Create a Question</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Content:</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Category:</label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
        </div>
        {/* Commenting out anonymous posting section
        <div>
          <label>Post Anonymously:</label>
          <input
            type="checkbox"
            checked={isAnonymous}
            onChange={(e) => setIsAnonymous(e.target.checked)}
          />
        </div>
        */}
        <div>
          <label>Scope:</label>
          <select value={scope} onChange={(e) => setScope(e.target.value)}>
            <option value="all">All Connections</option>
            <option value="primary">Primary Connections Only</option>
          </select>
        </div>
        <button type="submit">Create Question</button>
      </form>
    </div>
  );
};

export default CreateQuestion;
