/*
Promises lucky draw.
The `luckyDraw` function returns a promise.
Create a promise chain where the function is called for each of the players: Joe, Caroline and Sabrina.
Log in the console the resolved value for each promise and handle any promise rejections in the chain. */

function luckyDraw(player) {
  return new Promise((resolve, reject) => {
    const win = Boolean(Math.round(Math.random()));

    process.nextTick(() => {
      if (win) {
        resolve(`${player} won a prize in the draw!`);
      } else {
        reject(new Error(`${player} lost the draw.`));
      }
    });
  });
}

luckyDraw("Joe")
  .then((draw1Result) => console.log(draw1Result))
  .then(() => luckyDraw("Caroline"))
  .then((draw2Result) => console.log(draw2Result))
  .then(() => luckyDraw("Sabrina"))
  .then((draw3Result) => console.log(draw3Result))
  .catch((error) => console.error(error));
