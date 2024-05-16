/*
Use a method with a callback.
Create a script that uses the Node.js core fs.writeFile() (callback API) method to write a text file.
The documentation for this method is on the Node.js File system page:
https://nodejs.org/api/fs.html#fswritefilefile-data-options-callback
*/

const fs = require("node:fs");

fs.writeFile(
  "./Readme.txt",
  "In this file you can find information about the project",
  (err) => {
    if (err) {
      console.log(new Error(err));
    }
  }
);
