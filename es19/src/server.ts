//packages import declarations
import express from "express";
import "express-async-errors";
import morgan from "morgan";
import dotenv from "dotenv";
import multer from "multer";
import {
  getAll,
  getOneById,
  create,
  updateById,
  deleteById,
  createImage,
} from "./controllers/planets.js";

import {
  login,
  signup
} from "./controllers/users.js";

dotenv.config();

//creation of the server as an instance of express
const app = express();
const port = process.env.SERVER_PORT || 4000;

//use morgan module
app.use(morgan("dev"));

//for parsing application/JSON:
app.use(express.json());

//define how multer should store the uploaded files:
const storage = multer.diskStorage( {
  destination: './uploads',
  filename: (req, file, cb) => {
    cb(null, file.originalname)
  }
})

//creation of an instance of Multer with the configured storage:
const upload = multer({storage})

//routing
app.route("/api/planets").get(getAll).post(create);

app
  .route("/api/planets/:id")
  .get(getOneById)
  .put(updateById)
  .delete(deleteById);

app.post("/api/planets/:id/image", upload.single("image"), createImage)

app.post("/api/users/login", login);
app.post("/api/users/signup", signup);

//make the server listen on port specified by the environment variable
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
