const express = require("express");
const cors = require("cors");
const path = require("path");
const { LocalStorage } = require("node-localstorage");

const app = express();
app.use(cors());
app.use(express.json());

// Initialize node-localstorage to persist data in a folder called "localStorage"
const localStoragePath = path.join(__dirname, "localStorage");
const localStorage = new LocalStorage(localStoragePath);

// Initialize posts from localStorage or as an empty array
let posts = [];
try {
  posts = JSON.parse(localStorage.getItem("posts")) || [];
} catch (error) {
  posts = [];
}

// Set idCounter based on the highest existing id
let idCounter = posts.reduce((max, post) => Math.max(max, post._id), 0) + 1;

const updateLocalStorage = () => {
  localStorage.setItem("posts", JSON.stringify(posts));
};

// Get all posts
app.get("/posts", (req, res) => {
  res.json(posts);
});

// Create a new post
app.post("/posts", (req, res) => {
  try {
    const { title, content } = req.body;
    const newPost = {
      _id: idCounter++, // simple incremental id
      title,
      content,
      createdAt: new Date().toISOString(),
    };
    posts.push(newPost);
    updateLocalStorage();
    res.status(201).send("Post saved");
  } catch (error) {
    res.status(400).send("Error saving post");
  }
});

// Update a post by ID
app.put("/posts/:id", (req, res) => {
  try {
    const { id } = req.params;
    const index = posts.findIndex((post) => post._id == id);
    if (index === -1) {
      return res.status(404).send("Post not found");
    }
    posts[index] = { ...posts[index], ...req.body };
    updateLocalStorage();
    res.send("Post updated");
  } catch (error) {
    res.status(500).send("Error updating post");
  }
});

// Delete a post by ID
app.delete("/posts/:id", (req, res) => {
  try {
    const { id } = req.params;
    const initialLength = posts.length;
    posts = posts.filter((post) => post._id != id);
    if (posts.length === initialLength) {
      return res.status(404).send("Post not found");
    }
    updateLocalStorage();
    res.send("Post deleted");
  } catch (error) {
    res.status(500).send("Error deleting post");
  }
});

// Start server
const PORT = 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);