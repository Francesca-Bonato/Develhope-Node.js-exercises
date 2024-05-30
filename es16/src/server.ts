/*
- Using PgAdmin:
  - Create a Postgres DB.
- Using a `setupDb` function:
  - Create `planets` table.
  - Populate the table with two planets (e.g. `'Earth'` and `'Mars'`).
- Connect your app to Postgres using Express (`pg-promise`). [https://github.com/vitaly-t/pg-promise]
- Replace the dummy DB with the Postgres DB.
- Rewrite all planets controller functions. They should now work with the DB.
*/

//packages import declarations
import express from "express";
import "express-async-errors";
import morgan from "morgan";
import dotenv from "dotenv";
import {
  getAll,
  getOneById,
  create,
  updateById,
  deleteById,
} from "./controllers/planets.js";

dotenv.config();

//creation of the server as an instance of express
const app = express();
const port = process.env.SERVER_PORT || 4000;

//use morgan module
app.use(morgan("dev"));

//for parsing application/JSON:
app.use(express.json());

//routing
app.route("/api/planets").get(getAll).post(create);

app
  .route("/api/planets/:id")
  .get(getOneById)
  .put(updateById)
  .delete(deleteById);

//make the server listen on port specified by the environment variable
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
