import React, { useState } from "react";
import { suggestConnection } from "../services/api";
import { jwtDecode } from "jwt-decode";

const ConnectionSuggestionForm = () => {
  const [user1Username, setUser1Username] = useState("");
  const [user2Username, setUser2Username] = useState("");
  const [note, setNote] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (token) {
        const decodedToken = jwtDecode(token);
        const userId = decodedToken.userId;
        await suggestConnection(userId, { user1Username, user2Username, note });
        setUser1Username("");
        setUser2Username("");
        setNote("");
        // Show success message or handle the response as needed
      } else {
        // Handle case when user is not logged in
        // Redirect to login page or display a message
      }
    } catch (error) {
      console.error("Error suggesting connection:", error);
      // Show error message to the user
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="User 1 Username"
        value={user1Username}
        onChange={(e) => setUser1Username(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="User 2 Username"
        value={user2Username}
        onChange={(e) => setUser2Username(e.target.value)}
        required
      />
      <textarea
        placeholder="Add a note (optional)"
        value={note}
        onChange={(e) => setNote(e.target.value)}
      />
      <button type="submit">Suggest Connection</button>
    </form>
  );
};

export default ConnectionSuggestionForm;
