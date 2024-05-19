//import declarations
import { Request, Response } from "express";
import joi from "joi";

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

//create controller functions to handle routing logic:

//GET /api/planets: return all planets (JSON) with 200
const getAll = (req: Request, res: Response) => {
  res.status(200).json(planets);
};

//GET /api/planets/:id: return a planet (JSON) by id with 200
const getOneById = (req: Request, res: Response) => {
  const { id } = req.params;
  const planet = planets.find((p) => p.id === Number(id));
  if (planet) {
    res.status(200).json(planet);
  } else {
    res.status(404).json({ msg: "planet not found" });
  }
};

const planetSchema = joi.object({
  id: joi.number().integer().required(),
  name: joi.string().required(),
});

//POST /api/planets: create a planet, return only 201 code and a success JSON with key msg
const create = (req: Request, res: Response) => {
  const { id, name } = req.body;
  //Make sure every planet is created with id and name.
  const newPlanet: Planet = { id, name };
  const validatedNewPlanet = planetSchema.validate(newPlanet);

  if (validatedNewPlanet.error) {
    return res
      .status(400)
      .json({ msg: validatedNewPlanet.error.details[0].message });
  } else {
    planets = [...planets, newPlanet];
    res.status(201).json({ msg: "planet created" });
  }
};

const planetIdSchema = joi.number().integer().required();
const planetNameSchema = joi.string().required();

//PUT /api/planets/:id: update a planet by id, return only 200 code and a success JSON with key msg
const updateById = (req: Request, res: Response) => {
  const { id } = req.params;
  const { name } = req.body;
  //validation of incoming data
  const validatedId = planetIdSchema.validate(id);
  const validatedName = planetNameSchema.validate(name);
  if (validatedId.error || validatedName.error) {
    res.status(400).json({
      msg:
        validatedId.error?.details[0].message &&
        validatedName.error?.details[0].message,
    });
  } else {
    const planet = planets.find((p) => p.id === Number(id));
    if (planet) {
      planets = planets.map((p) => (p.id === Number(id) ? { ...p, name } : p));
      res.status(200).json({ msg: "planet updated" });
    } else {
      res.status(404).json({ msg: "planet not found" });
    }
  }
};

//DELETE /api/planets/:id: delete a planet by id, return only 200 code and a success JSON with key msg
const deleteById = (req: Request, res: Response) => {
  const { id } = req.params;
  //validation of incoming data
  const validatedId = planetIdSchema.validate(id);
  if (validatedId.error) {
    res.status(400).json({
      msg: validatedId.error.details[0].message,
    });
  } else {
    const planet = planets.find((p) => p.id === Number(id));
    if (planet) {
      planets = planets.filter((p) => p.id !== Number(id));
      res.status(200).json({ msg: "planet deleted" });
    } else {
      res.status(404).json({ msg: "planet not found" });
    }
  }
};

//export declaration
export { getAll, getOneById, create, updateById, deleteById };
