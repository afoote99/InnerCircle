const express = require("express");
const router = express.Router();
const Connection = require("../models/connection");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");
const { Op } = require("sequelize");
const moment = require("moment");

// Get user's network
router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const connections = await Connection.findAll({
      where: {
        [Op.or]: [{ user_id_1: userId }, { user_id_2: userId }],
      },
      include: [
        {
          model: User,
          as: "user1",
          attributes: ["user_id", "username"],
        },
        {
          model: User,
          as: "user2",
          attributes: ["user_id", "username"],
        },
      ],
    });

    if (!connections) {
      return res.status(404).json({ error: "User connections not found" });
    }

    const formattedConnections = connections.map((conn) => ({
      connectionId: conn.connection_id,
      status: conn.status,
      connected_since: moment(conn.connected_since).toISOString(), // Format date to ISO string
      user1: {
        userId: conn.user1.user_id,
        username: conn.user1.username,
      },
      user2: {
        userId: conn.user2.user_id,
        username: conn.user2.username,
      },
    }));

    // Retrieve received connection requests
    const receivedRequests = await ConnectionRequest.findAll({
      where: { receiver_id: userId, status: "pending" },
      include: [
        {
          model: User,
          as: "sender",
          attributes: ["user_id", "username"],
        },
        {
          model: User,
          as: "suggester",
          attributes: ["user_id", "username"],
        },
      ],
    });

    res.status(200).json({
      connections: formattedConnections,
      receivedRequests: receivedRequests.map((req) => ({
        requestId: req.request_id,
        status: req.status,
        createdAt: req.createdAt,
        sender: {
          userId: req.sender.user_id,
          username: req.sender.username,
        },
        note: req.note,
        suggester: req.suggester
          ? {
              userId: req.suggester.user_id,
              username: req.suggester.username,
            }
          : null,
      })),
    });
  } catch (error) {
    console.error("Error retrieving user's network:", error);
    res
      .status(500)
      .json({ error: "An error occurred while retrieving the user's network" });
  }
});

// Update user's network
router.put("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const { connectionId, status } = req.body;
    const connection = await Connection.findOne({
      where: { connection_id: connectionId },
      include: [
        {
          model: User,
          as: "user1",
          attributes: ["user_id", "username"],
        },
        {
          model: User,
          as: "user2",
          attributes: ["user_id", "username"],
        },
      ],
    });

    if (connection) {
      connection.status = status;
      await connection.save();
      res.status(200).json({
        connectionId: connection.connection_id,
        status: connection.status,
        connected_since: connection.connected_since,
        user1: {
          userId: connection.user1.user_id,
          username: connection.user1.username,
        },
        user2: {
          userId: connection.user2.user_id,
          username: connection.user2.username,
        },
      });
    } else {
      res.status(404).json({ error: "Connection not found" });
    }
  } catch (error) {
    console.error("Error updating user's network:", error);
    res
      .status(500)
      .json({ error: "An error occurred while updating the user's network" });
  }
});

// Send a connection request
router.post("/:userId/request", async (req, res) => {
  try {
    const { userId } = req.params;
    const { receiverUsername, note } = req.body;

    // Find the receiver user by username
    const receiver = await User.findOne({
      where: { username: receiverUsername },
    });
    if (!receiver) {
      return res.status(404).json({ error: "Receiver user not found" });
    }

    // Check if a connection or request already exists between the users
    const existingConnection = await Connection.findOne({
      where: {
        [Op.or]: [
          { user_id_1: userId, user_id_2: receiver.userId },
          { user_id_1: receiver.userId, user_id_2: userId },
        ],
      },
    });

    const existingRequest = await ConnectionRequest.findOne({
      where: {
        [Op.or]: [
          {
            sender_id: userId,
            receiver_id: receiver.userId,
            status: "pending",
          },
          {
            sender_id: receiver.userId,
            receiver_id: userId,
            status: "pending",
          },
        ],
      },
    });

    if (existingConnection || existingRequest) {
      return res
        .status(400)
        .json({ error: "Connection or request already exists" });
    }

    // Create a new connection request with a note
    const newRequest = await ConnectionRequest.create({
      sender_id: userId,
      receiver_id: receiver.userId, // Use 'userId' instead of 'user_id'
      note: note, // Include the note
    });

    res.status(201).json(newRequest);
  } catch (error) {
    console.error("Error sending connection request:", error);
    if (
      error.name === "SequelizeDatabaseError" &&
      error.message.includes("WHERE parameter")
    ) {
      return res.status(400).json({ error: "Invalid receiver username" });
    }
    res.status(500).json({
      error: "An error occurred while sending the connection request",
    });
  }
});

// Accept a connection request
router.put("/:userId/request/:requestId/accept", async (req, res) => {
  const { userId, requestId } = req.params;
  const { isPrimary } = req.body;

  try {
    // Find the connection request that is pending and matches the receiver ID
    const request = await ConnectionRequest.findOne({
      where: { request_id: requestId, receiver_id: userId, status: "pending" },
    });

    if (!request) {
      return res.status(404).json({ error: "Connection request not found" });
    }

    // Update the request status to "accepted"
    request.status = "accepted";
    await request.save();

    if (request.suggester_id) {
      // If it's a suggested connection, check if the corresponding request for the other user is also accepted
      const correspondingRequest = await ConnectionRequest.findOne({
        where: {
          sender_id: request.receiver_id,
          receiver_id: request.sender_id,
          status: "accepted",
          suggester_id: request.suggester_id,
        },
      });

      if (correspondingRequest) {
        // Create a new connection if both requests are accepted
        const newConnection = await Connection.create({
          user_id_1: request.sender_id,
          user_id_2: request.receiver_id,
          status: "accepted",
          connected_since: new Date(),
        });
        res.status(200).json(newConnection);
      } else {
        res
          .status(200)
          .json({ message: "Suggested connection request accepted" });
      }
    } else {
      // If it's a normal connection request, create the connection immediately
      const newConnection = await Connection.create({
        user_id_1: request.sender_id,
        user_id_2: request.receiver_id,
        status: "accepted",
        connected_since: new Date(),
        isPrimary: isPrimary,
      });
      res.status(200).json(newConnection);
    }
  } catch (error) {
    console.error("Error accepting connection request:", error);
    res.status(500).json({
      error: "An error occurred while accepting the connection request",
    });
  }
});

// Decline a connection request
router.put("/:userId/request/:requestId/decline", async (req, res) => {
  const { userId, requestId } = req.params;

  try {
    // Find the connection request that is pending and matches the receiver ID
    const request = await ConnectionRequest.findOne({
      where: { request_id: requestId, receiver_id: userId, status: "pending" },
    });

    if (!request) {
      return res.status(404).json({ error: "Connection request not found" });
    }

    // Update the request status to "declined"
    request.status = "declined";
    await request.save();

    res.status(200).json(request);
  } catch (error) {
    console.error("Error declining connection request:", error);
    res.status(500).json({
      error: "An error occurred while declining the connection request",
    });
  }
});

// Suggest a connection
router.post("/:userId/suggest", async (req, res) => {
  try {
    const { userId } = req.params;
    const { user1Username, user2Username, note } = req.body;

    // Find the users by username
    const user1 = await User.findOne({ where: { username: user1Username } });
    const user2 = await User.findOne({ where: { username: user2Username } });
    if (!user1 || !user2) {
      return res.status(404).json({ error: "One or both users not found" });
    }

    // Check if the suggesting user is connected to both users
    const isConnectedToUser1 = await Connection.findOne({
      where: {
        [Op.or]: [
          { user_id_1: userId, user_id_2: user1.userId },
          { user_id_1: user1.userId, user_id_2: userId },
        ],
      },
    });
    const isConnectedToUser2 = await Connection.findOne({
      where: {
        [Op.or]: [
          { user_id_1: userId, user_id_2: user2.userId },
          { user_id_1: user2.userId, user_id_2: userId },
        ],
      },
    });
    if (!isConnectedToUser1 || !isConnectedToUser2) {
      return res.status(400).json({
        error: "You must be connected to both users to suggest a connection",
      });
    }

    // Check if a connection already exists between the users
    const existingConnection = await Connection.findOne({
      where: {
        [Op.or]: [
          { user_id_1: user1.userId, user_id_2: user2.userId },
          { user_id_1: user2.userId, user_id_2: user1.userId },
        ],
      },
    });

    if (existingConnection) {
      return res.status(400).json({ error: "Users are already connected" });
    }

    // Create connection requests for both users with a note and the suggesting user's ID
    await ConnectionRequest.create({
      sender_id: user1.userId,
      receiver_id: user2.userId,
      note: note,
      suggester_id: userId, // Store the suggesting user's ID
    });
    await ConnectionRequest.create({
      sender_id: user2.userId,
      receiver_id: user1.userId,
      note: note,
      suggester_id: userId, // Store the suggesting user's ID
    });

    res.status(201).json({ message: "Connection suggestion sent" });
  } catch (error) {
    console.error("Error suggesting connection:", error);
    res
      .status(500)
      .json({ error: "An error occurred while suggesting the connection" });
  }
});

//check connections for a user
router.get("/connections/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const connections = await Connection.findAll({
      where: {
        [Op.or]: [{ user_id_1: userId }, { user_id_2: userId }],
        status: "accepted",
      },
      include: [
        { model: User, as: "user1", attributes: ["userId", "username"] },
        { model: User, as: "user2", attributes: ["userId", "username"] },
      ],
    });

    const formattedConnections = connections.map((conn) => ({
      connectionId: conn.connection_id,
      isPrimary: conn.isPrimary,
      user1: {
        userId: conn.user1.userId,
        username: conn.user1.username,
      },
      user2: {
        userId: conn.user2.userId,
        username: conn.user2.username,
      },
    }));

    res.json(formattedConnections);
  } catch (error) {
    console.error("Error fetching connections:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching connections" });
  }
});

module.exports = router;
