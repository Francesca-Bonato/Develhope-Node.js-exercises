/*
Add planets validation: validate planet fields where appropriate (use joi library).
Add planets Controller (controllers/planets.ts) consisting of the following functions:
- getAll
- getOneById
- create
- updateById
- deleteById.
Then, replace callback functions in routes (req: Request, res: Response) => with the functions above.
(For example: the route /api/planets should use getAll function.)
*/

//packages import declarations
import express from "express";
import "express-async-errors";
import morgan from "morgan";
import dotenv from "dotenv";
import { getAll, getOneById, create, updateById, deleteById } from "./controllers/planets.js"

dotenv.config();

//creation of the server as an instance of express
const app = express();
const port = process.env.SERVER_PORT || 4000;

//use morgan module
app.use(morgan("dev"));

//for parsing application/JSON:
app.use(express.json());

//routing
app.route("/api/planets")
  .get(getAll)
  .post(create);

app.route("/api/planets/:id")
  .get(getOneById)
  .put(updateById)
  .delete(deleteById);

//make the server listen on port specified by the environment variable
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
