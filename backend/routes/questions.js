const express = require("express");
const router = express.Router();
const Question = require("../models/question");
const Answer = require("../models/answer");
const User = require("../models/user");
const Connection = require("../models/connection");
const { Op } = require("sequelize");

// Create a new question
router.post("/", async (req, res) => {
  try {
    const { title, content, category, userId, scope } = req.body;

    const questionData = {
      title,
      content,
      category,
      user_id: userId,
      scope,
      posted_date: new Date(),
    };

    const question = await Question.create(questionData);
    res.status(201).json(question);
  } catch (error) {
    console.error("Error creating question:", error);
    res
      .status(500)
      .json({ error: "An error occurred while creating the question" });
  }
});

// Get questions for a user's feed
router.get("/feed", async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    console.log(`Fetching questions for user: ${userId}`);

    // Get user's connections
    const connections = await Connection.findAll({
      where: {
        [Op.or]: [{ user_id_1: userId }, { user_id_2: userId }],
        status: "accepted",
      },
    });

    console.log(`Found ${connections.length} connections for user ${userId}`);

    const connectedUserIds = connections.map((conn) =>
      conn.user_id_1.toString() === userId.toString()
        ? conn.user_id_2.toString()
        : conn.user_id_1.toString()
    );

    const primaryConnections = connections.filter((conn) => conn.isPrimary);
    const primaryConnectedUserIds = primaryConnections.map((conn) =>
      conn.user_id_1.toString() === userId.toString()
        ? conn.user_id_2.toString()
        : conn.user_id_1.toString()
    );

    console.log(`Connected user IDs: ${connectedUserIds}`);
    console.log(`Primary connected user IDs: ${primaryConnectedUserIds}`);

    const questions = await Question.findAll({
      where: {
        [Op.or]: [
          { user_id: { [Op.in]: connectedUserIds }, scope: "all" },
          { user_id: { [Op.in]: primaryConnectedUserIds }, scope: "primary" },
          { user_id: userId },
        ],
      },
      include: [
        { model: User, as: "user", attributes: ["userId", "username"] },
        {
          model: Answer,
          as: "answers",
          include: [
            { model: User, as: "user", attributes: ["userId", "username"] },
          ],
        },
      ],
      order: [["posted_date", "DESC"]],
    });

    console.log(`Found ${questions.length} questions`);
    res.status(200).json(questions);
  } catch (error) {
    console.error("Error retrieving questions:", error);
    res.status(500).json({
      error: "An error occurred while retrieving the questions",
      details: error.message,
    });
  }
});

// Get all questions with associated user and answers (without visibility filters)
router.get("/all", async (req, res) => {
  try {
    const questions = await Question.findAll({
      include: [
        { model: User, as: "user", attributes: ["userId", "username"] },
        {
          model: Answer,
          as: "answers",
          include: [
            { model: User, as: "user", attributes: ["userId", "username"] },
          ],
        },
      ],
      order: [["posted_date", "DESC"]],
    });

    res.status(200).json(questions);
  } catch (error) {
    console.error("Error retrieving all questions:", error);
    res.status(500).json({
      error: "An error occurred while retrieving all questions",
      details: error.message,
    });
  }
});

// Answer a question
router.post("/:questionId/answer", async (req, res) => {
  try {
    const { questionId } = req.params;
    const { content, userId } = req.body;
    const answer = await Answer.create({
      content,
      user_id: userId,
      question_id: questionId,
    });
    res.status(201).json(answer);
  } catch (error) {
    console.error("Error answering question:", error);
    res
      .status(500)
      .json({ error: "An error occurred while answering the question" });
  }
});

// Fetch a single question by ID
router.get("/:questionId", async (req, res) => {
  try {
    const question = await Question.findByPk(req.params.questionId, {
      include: [
        {
          model: User,
          as: "user", // Match the alias used in the association
          attributes: ["username"],
        },
        {
          model: Answer,
          as: "answers", // Match the alias used in the association
          include: [
            {
              model: User,
              as: "user", // Match the alias used in the association
              attributes: ["username"],
            },
          ],
        },
      ],
    });
    if (question) {
      res.json(question);
    } else {
      res.status(404).send("Question not found");
    }
  } catch (error) {
    console.error("Error fetching specific question:", error);
    res.status(500).json({ message: "Error fetching question" });
  }
});

module.exports = router;
