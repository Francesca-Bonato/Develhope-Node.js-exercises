/*
Write a router with the following routes:
GET /api/planets: return all planets (JSON) with 200
GET /api/planets/:id: return a planet (JSON) by id with 200
POST /api/planets: create a planet, return only 201 code and a success JSON with key msg
Make sure every planet is created with id and name.
PUT /api/planets/:id: update a planet by id, return only 200 code and a success JSON with key msg
DELETE /api/planets/:id: delete a planet by id, return only 200 code and a success JSON with key msg
Validate planet fields where appropriate.
*/

//packages import declarations
import express from "express";
import "express-async-errors";
import morgan from "morgan";
import dotenv from "dotenv";

dotenv.config();

//creation of the server as an instance of express
const app = express();
const port = process.env.SERVER_PORT || 4000;

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

//routing
app.route("/api/planets")
  //GET /api/planets: return all planets (JSON) with 200
  .get((req, res) => {
    res.status(200).json(planets)
  })
  //POST /api/planets: create a planet, return only 201 code and a success JSON with key msg
  .post((req, res) => {
    const {id, name} = req.body;
    //Make sure every planet is created with id and name.
    const newPlanet = {id, name}
    planets = [...planets, newPlanet]
    res.status(201).json({msg : "planet created"})
  })

app.route("/api/planets/:id")
  //GET /api/planets/:id: return a planet (JSON) by id with 200
  .get((req, res) => {
    const {id} = req.params;
    const planet = (planets.find(p => p.id === Number(id)));
    res.status(200).json(planet);
  })
  //PUT /api/planets/:id: update a planet by id, return only 200 code and a success JSON with key msg
  .put((req, res) => {
    const {id} = req.params;
    const {name} = req.body;
    planets = planets.map(p => p.id === Number(id)? {...p, name} : p)
    res.status(200).json({msg: "planet updated"})
  })
  //DELETE /api/planets/:id: delete a planet by id, return only 200 code and a success JSON with key msg
  .delete((req, res) => {
    const {id} = req.params;
    planets = planets.filter(p => p.id !== Number(id))
    res.status(200).json({msg: "planet delated"})
  }
)

//make the server listen on port specified by the environment variable
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
