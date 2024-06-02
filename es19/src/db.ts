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
    DROP TABLE IF EXISTS users;
    CREATE TABLE users (
    id SERIAL NOT NULL PRIMARY KEY,
    username TEXT NOT NULL,
    password TEXT NOT NULL,
    token TEXT
  );
  `);
  await db.none(`INSERT INTO planets (name) VALUES ('Mars');`);
  await db.none(`INSERT INTO planets (name) VALUES ('Earth');`);
};
setupDb();

export { db };
