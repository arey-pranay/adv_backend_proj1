// backend is -
// creating endpoints for handling the requests of the client (e.g., browser) at any particular route
// handling means to process the request and send a response back to the client
// we need to create a backend app (i.e., a server) with express.js, you can use more configs like middleware etc

import express from "express";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/authRoutes.js"; // import the authRoutes from the authRoutes.js file
import todoRoutes from "./routes/todoRoutes.js"; // import the todoRoutes from the todoRoutes.js file

const app = express();
const PORT = process.env.PORT || 5003;
console.log("heyy world");

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
app.use(express.json());
app.use(express.static(path.join(__dirname, "../public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.use("/auth", authRoutes); // use the authRoutes for any request that starts with /auth
app.use("/todos", todoRoutes); // use the authRoutes for any request that starts with /auth

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
