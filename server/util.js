function genDateValue(n, low, high) {
  return Array(n)
    .fill(1)
    .map((d, i) => {
      return {
        date: new Date(Date.now() - i * 3600000 * 24 * 30),
        value: randomIntInc(low, high)
      };
    });
}

function randomIntInc(low, high) {
  return Math.floor(Math.random() * (high - low + 1) + low);
}

module.exports = {
  genDateValue,
  randomIntInc
};
