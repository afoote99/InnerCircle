const express = require("express");
const router = express.Router();
const Question = require("../models/question");
const Answer = require("../models/answer");
const User = require("../models/user");
const Connection = require("../models/connection");

// Create a new question
router.post("/", async (req, res) => {
  try {
    const { title, content, category, userId, isAnonymous } = req.body;
    console.log("Received isAnonymous value:", isAnonymous);
    console.log("Type of isAnonymous value:", typeof isAnonymous);

    const questionData = {
      title,
      content,
      category,
      user_id: userId,
      is_anonymous: isAnonymous, // Directly assign the value
      posted_date: new Date(),
    };
    console.log("Question data to be created:", questionData);

    const question = await Question.create(questionData);

    console.log("Created question with is_anonymous:", question.is_anonymous);
    res.status(201).json(question);
  } catch (error) {
    console.error("Error creating question:", error);
    res
      .status(500)
      .json({ error: "An error occurred while creating the question" });
  }
});
// Get all questions with associated user and answers
router.get("/", async (req, res) => {
  try {
    const { userId } = req.query;
    const questions = await Question.findAll({
      include: [
        {
          model: User,
          as: "user",
          attributes: ["userId", "username"],
          include: [
            {
              model: Connection,
              as: "connectionsInitiated", // Specify the alias for this association
              include: [
                {
                  model: User,
                  as: "user2",
                  attributes: ["userId", "username"],
                },
              ],
            },
            {
              model: Connection,
              as: "connectionsReceived", // Specify the alias for this association
              include: [
                {
                  model: User,
                  as: "user1",
                  attributes: ["userId", "username"],
                },
              ],
            },
          ],
        },
        {
          model: Answer,
          as: "answers",
          include: [
            { model: User, as: "user", attributes: ["userId", "username"] },
          ],
        },
      ],
    });
    res.status(200).json(questions);
  } catch (error) {
    console.error("Error retrieving questions:", error);
    res.status(500).json({
      error: "An error occurred while retrieving the questions",
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

module.exports = router;
