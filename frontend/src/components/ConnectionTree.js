import React, { useState, useEffect } from "react";
import { fetchConnectionTree } from "../services/api";
import { Typography, Paper } from "@mui/material";

const ConnectionTree = ({ userId, targetId }) => {
  const [tree, setTree] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadTree = async () => {
      try {
        if (userId && targetId) {
          const data = await fetchConnectionTree(userId, targetId);
          setTree(data);
        } else {
          setError("Invalid user IDs");
        }
      } catch (err) {
        setError("Failed to load connection tree");
      }
    };

    loadTree();
  }, [userId, targetId]);

  if (error) return <Typography color="error">{error}</Typography>;
  if (!tree) return <Typography>Loading connection tree...</Typography>;

  return (
    <Paper elevation={3} style={{ padding: "20px", marginTop: "20px" }}>
      <Typography variant="h6">Connection Tree</Typography>
      {tree.map((node, index) => (
        <Typography key={node.id}>
          {index > 0 && " → "}
          {node.username}
        </Typography>
      ))}
    </Paper>
  );
};

export default ConnectionTree;
