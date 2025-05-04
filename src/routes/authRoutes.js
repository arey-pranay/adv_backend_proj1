import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "../db.js";
const router = express.Router();

router.post("/register", async (req, res) => {
  const { username, password } = req.body;
  console.log(username, password);
  const hashedPassword = await bcrypt.hash(password, 10); // hash with password and a salt of 10

  try {
    const insertUser = db.prepare(
      "INSERT INTO users (username, password) VALUES (?, ?)"
    );

    const result = insertUser.run(username, hashedPassword);

    // adding a random default first to-do for the user from us
    const defaultTodo = `Hello, this is your first todo`;
    const insertTodo = db
      .prepare("INSERT INTO todos (user_id, task) VALUES (?, ?)")
      .run(result.lastInsertRowid, defaultTodo);

    // creating a user token for the user
    const token = jwt.sign(
      { id: result.lastInsertRowid },
      `${process.env.JWT_SECRET}`,
      { expiresIn: "24h" }
    );

    res.json({ token });
  } catch (error) {
    console.log(error.message);
    return res.status(503).json({ error: "Service Unavailable" });
  }
  // res.sendStatus(201);
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  console.log(username, password);

  try {
    const getUser = db.prepare("SELECT * FROM users WHERE username = ?");
    const user = getUser.get(username);
    const allUsers = db.prepare("SELECT * FROM users").all();
    console.log(allUsers);
    if (!user) {
      return res.status(401).json({ error: "Invalid username" });
    }
    const isPasswordValid = bcrypt.compareSync(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid password" });
    }

    const token = jwt.sign({ id: user.id }, `${process.env.JWT_SECRET}`, {
      expiresIn: "24h",
    });

    return res.status(200).json({ token });
  } catch (error) {
    console.log(error.message);
    return res.status(503).json({ error: "Service Unavailable" });
  }
});

export default router;
