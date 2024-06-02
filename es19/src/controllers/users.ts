//import declarations
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { db } from "../db.js";
import dotenv from "dotenv";
dotenv.config();

/* Login:
- Check that a provided username exists in DB, and that a provided password and the password in the DB match.
- If they don't, respond with an error.
- If they do, respond with token (JWT), id and username. */
const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  const user = await db.oneOrNone(
    `SELECT * FROM users WHERE username = $1`,
    username
  );
  if (user && user.password === password) {
    const payload = {
      id: user.id,
      username,
    };
    const secretKey = process.env.SECRET || "";
    const token = jwt.sign(payload, secretKey);
    console.log(token);
    await db.none(`UPDATE users SET token=$2 WHERE id=$1`, [user.id, token]);
    res.status(200).json({
      id: user.id,
      username,
      token,
    });
  } else {
    res.status(400).json({ msg: "Username or password incorrect" });
  }
};

/* Signup:
- Check that provided username does not exists in DB.
- If not, store user with username and password keys in the DB, and respond with JSON {msg: "Signup successful. Now you can log in."} */
const signup = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  const user = await db.oneOrNone(
    `SELECT * FROM users WHERE username = $1`,
    username
  );
  if (user) {
    res.status(409).json({ msg: "Username already in use" });
  } else {
    const { id } = await db.one(
      "INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id",
      [username, password]
    );
    res.status(201).json({ id, msg: "Signup successful. Now you can log in." });
  }
};

export { login, signup };
