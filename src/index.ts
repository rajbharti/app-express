import express from "express";
import morgan from "morgan";

interface User {
  id?: number;
  name: string;
  email: string;
}

let users: User[] = [
  { id: 1, name: "Alice", email: "alice@example.com" },
  { id: 2, name: "Bob", email: "bob@example.com" },
  { id: 3, name: "Charlie", email: "charlie@example.com" },
];

const app = express();
const port = 3001;

// parses incoming requests in body with JSON payloads.
app.use(express.json());
app.use(morgan("short"));

// Get all users
app.get("/users", (req, res) => {
  res.json(users);
});

// Get a specific user
app.get("/users/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const user = users.find((u) => u.id === id);

  if (user) {
    res.json(user);
  } else {
    res.sendStatus(400);
  }
});

// Add a new user
app.post("/users", (req, res) => {
  const user: User = req.body;
  user.id = users.length + 1;

  if (user.name !== undefined && user.email !== undefined) {
    users.push(user);
    res.sendStatus(201);
  }

  res.sendStatus(400);
});

// Update an existing user
app.put("/users/:id", (req, res) => {
  const updatedUser: User = req.body;
  const id = parseInt(req.params.id);
  const userIndex = users.findIndex((u) => u.id === id);

  if (
    userIndex === -1 ||
    (updatedUser.name === undefined && updatedUser.email === undefined)
  ) {
    res.sendStatus(400);
  }

  users[userIndex] = { ...users[userIndex], id, ...updatedUser };
  res.sendStatus(204);
});

// Delete a user
app.delete("/users/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const userIndex = users.findIndex((u) => u.id === id);

  if (userIndex === -1) {
    res.sendStatus(400);
  }

  users.splice(userIndex, 1);
  res.sendStatus(204);
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
