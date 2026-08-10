const express = require("express");
const router = express.Router();
const { jwtAuthMiddleware, generateToken } = require("../jwt");
const Candidate = require("../models/candidate");
const User = require("../models/user");

// Create a function to check role admin or not
const checkAdminRole = async (userID) => {
  try {
    const user = await User.findById(userID);
    return user.role === "admin";
  } catch (err) {
    return false;
  }
};

// POST route to add a candidate
router.post("/", jwtAuthMiddleware, async (req, res) => {
  try {
    if (!(await checkAdminRole(req.user.id)))
      return res.status(403).json({ message: "user does not have admin role" });

    const data = req.body; // Assuming the request body conatains the candidate data

    // Create a new candidate document using the Mongoose model
    const newCandidate = new Candidate(data);

    // Save the new candidate to the database
    const response = await newCandidate.save();
    console.log("data saved");

    res.status(200).json({ response: response });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal server Error" });
  }
});

// Update routes of candidate
router.put("/:candidateID", jwtAuthMiddleware, async (req, res) => {
  try {
    if (!(await checkAdminRole(req.user.id)))
      return res.status(403).json({ message: "user does not have admin role" });

    const candidateID = req.params.candidateID; // Extract the id from the URL parameter
    const updateCandidateData = req.body; // Update data for the person

    const response = await Candidate.findByIdAndUpdate(
      candidateID,
      updateCandidateData,
      {
        new: true, // Return the updated document
        runValidators: true, // Run mongoose validation
      },
    );

    if (!response) {
      return res.status(404).json({ error: "Candidate not found" });
    }

    console.log("candidate data updated");
    res.status(200).json(response);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Delete routes of candidate

router.delete("/:candidateID", jwtAuthMiddleware, async (req, res) => {
  try {
    if (!(await checkAdminRole(req.user.id)))
      return res.status(403).json({ message: "user does not have admin role" });

    const candidateID = req.params.candidateID; // Extract the id from the URL parameter

    const updateCandidateData = req.body; // Update data for the person

    const response = await Candidate.findByIdAndDelete(candidateID);

    if (!response) {
      return res.status(404).json({ error: "Candidate not found" });
    }

    console.log("candidate deleted");

    res.status(200).json(response);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Let's start voting
router.post("/vote/:candidateID", jwtAuthMiddleware, async (req, res) => {
  // No admin can vote
  // User can only vote once

  candidateID = req.params.candidateID;
  userId = req.user.id;

  try {
    // Find the candidate document with the specified candidateID
    const candidate = await Candidate.findById(candidateID);
    if (!candidate) {
      return res.status(404).json({ message: "CandidateID" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }

    if (user.isVoted) {
      return res.status(400).json({ message: "You have already voted" });
    }

    if (user.role == "admin") {
      return res.status(403).json({ message: "admin is not allowed" });
    }

    // Update the candidate document to record the vote
    candidate.votes.push({ user: userId });
    candidate.votedCount++;
    await candidate.save();

    // Update the user document
    user.isVoted = true;
    await user.save();
    res.status(200).json({ message: "Vote recorded successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Vote Count
router.get("/vote/count", async (req, res) => {
  try {
    // Find all candidates and sort them by voteCount in descending order
    const candidate = await Candidate.find().sort({ voteCount: "desc" });

    // Map the candidates to only return their name and voteCount
    const voteRecord = candidate.map((data) => {
      return {
        name: data.name,
        party: data.party,
        count: data.votedCount,
      };
    });

    return res.status(200).json(voteRecord);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Route to get the list of all candidates
router.get("/", async (req, res) => {
  try {
    const candidates = await Candidate.find();

    // Map the candidates to return their _id, name, and party
    const listCandidate = candidates.map((data) => {
      return {
        _id: data._id, // Essential for the Vote button to work
        name: data.name, // Essential to show on the dashboard
        party: data.party,
        age: data.age,
      };
    });

    return res.status(200).json(listCandidate);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
