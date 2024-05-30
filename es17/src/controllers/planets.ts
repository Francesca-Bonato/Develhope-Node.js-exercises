//import declarations
import { Request, Response } from "express";
import joi from "joi";
import pgPromise from "pg-promise";

//create an instance of the pg-promise library:
const db = pgPromise()(
  "postgres://postgres:postgres@localhost:5432/esDevelhope"
);

//crete function to populate database:
const setupDb = async () => {
  await db.none(`
    DROP TABLE IF EXISTS planets;
    CREATE TABLE planets (
      id SERIAL NOT NULL PRIMARY KEY,
      name TEXT NOT NULL,
      image TEXT
    );
  `);
  await db.none(`INSERT INTO planets (name) VALUES ('Mars');`);
  await db.none(`INSERT INTO planets (name) VALUES ('Earth');`);
};
setupDb();

//create controller functions to handle routing logic:

//GET /api/planets: return all planets (JSON) with 200
const getAll = async (req: Request, res: Response) => {
  const planets = await db.many(`SELECT * FROM planets;`);
  res.status(200).json(planets);
};

//GET /api/planets/:id: return a planet (JSON) by id with 200
const getOneById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const planet = await db.oneOrNone(
    `SELECT * FROM planets WHERE id = $1;`,
    Number(id)
  );
  if (planet) {
    res.status(200).json(planet);
  } else {
    res.status(404).json({ msg: "planet not found" });
  }
};

const planetSchema = joi.object({
  name: joi.string().required(),
});

//POST /api/planets: create a planet, return only 201 code and a success JSON with key msg
const create = async (req: Request, res: Response) => {
  const { name } = req.body;
  const newPlanet = { name };
  const validatedNewPlanet = planetSchema.validate(newPlanet);

  if (validatedNewPlanet.error) {
    return res
      .status(400)
      .json({ msg: validatedNewPlanet.error.details[0].message });
  } else {
    await db.none(`INSERT INTO planets (name) VALUES ($1);`, name);
    res.status(201).json({ msg: "planet created" });
  }
};

const planetIdSchema = joi.number().integer().required();
const planetNameSchema = joi.string().required();

//PUT /api/planets/:id: update a planet by id, return only 200 code and a success JSON with key msg
const updateById = async (req: Request, res: Response) => {
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
    await db.none(`UPDATE planets SET name=$2 WHERE id=$1;`, [id, name]);
    res.status(200).json({ msg: "planet updated" });
  }
};

//DELETE /api/planets/:id: delete a planet by id, return only 200 code and a success JSON with key msg
const deleteById = async (req: Request, res: Response) => {
  const { id } = req.params;
  //validation of incoming data
  const validatedId = planetIdSchema.validate(id);
  if (validatedId.error) {
    res.status(400).json({
      msg: validatedId.error.details[0].message,
    });
  } else {
    await db.none(`DELETE FROM planets WHERE id=$1;`, id);
    res.status(200).json({ msg: "planet deleted" });
  }
};

const createImage = async (req: Request, res: Response) => {
  const { id } = req.params;
  const filename = req.file?.path;
  if (filename) {
    db.none(
      ` UPDATE planets
    SET image=$2
    WHERE id=$1;`,
      [id, filename]
    );
    res.status(201).json({ msg: "Planet image uploaded successfully" });
  } else {
    res.status(400).json({ msg: "Image upload failed" });
  }
};

//export declaration
export { getAll, getOneById, create, updateById, deleteById, createImage };
