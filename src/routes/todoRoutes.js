import express from "express";
import db from "../db.js"; // import the database connection

const router = express.Router();

router.get("/", (req, res) => {});

router.post("/", (req, res) => {});

router.put("/:id", (req, res) => {});

router.delete("/:id", (req, res) => {});

export default router;
