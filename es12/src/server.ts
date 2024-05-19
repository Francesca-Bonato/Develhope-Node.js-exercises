/*
- Write a simple Express server that listens on port `3000` (use dotenv to specify the port)
- Create a dummy "database" of `planets` using a `let` variable. (You will use this data in further exercises.)
- Configure your app (`app.use()`) to:
  - accept JSON from the Client
  - log the Client's requests
*/

//packages import declarations
import express from "express";
import "express-async-errors";
import morgan from "morgan";
import dotenv from "dotenv";

dotenv.config();

//creation of the server as an instance of express
const app = express();
const port = process.env.PORT || 4000;

//use morgan module
app.use(morgan("dev"));

//type declaration of Planet object
type Planet = {
  id: number;
  name: string;
};

//type declaration of Planets array
type Planets = Planet[];

//creation of the dummy database "planets"
let planets: Planets = [
  {
    id: 1,
    name: "Earth",
  },
  {
    id: 2,
    name: "Mars",
  },
];

//for parsing application/JSON
app.use(express.json());
//for parsing application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

//log any request received by the client
app.all("/", (req, res) => {
  console.log(`${req.method} request received`);
  Object.keys(req.body).length !== 0
    ? console.log(req.body)
    : console.log("The body of the request is empty");
  res.send("Thank you for sending a request!");
});

//make the server listen on port specified by the environment variable
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
