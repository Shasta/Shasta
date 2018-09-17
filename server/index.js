const jsonServer = require("json-server");
const server = jsonServer.create();
const router = jsonServer.router("./db.json");
const middlewares = jsonServer.defaults();

const util = require("./util");

server.use(middlewares);

server.post("/createAccount", (req, res) => {
  res.jsonp({
    message: "Acount created correctly",
    status: 200
  });
});

server.get("/accountInfo", (req, res) => {
  res.jsonp({
    hardware_id: "0x4b9db3633e4c583bf660cc32bf523d8e10cb78de",
    status: "conected",
    consumedEnergy: util.randomIntInc(30, 50),
    surplusEnergy: util.randomIntInc(10, 20),
    remainingSurplusEnergy: util.randomIntInc(1, 5)
  });
});

server.get("/historyConsumedEnergy", (req, res) => {
  res.jsonp({
    data: util.genDateValue(6, 20, 120)
  });
});

server.get("/historySurplusEnergy", (req, res) => {
  res.jsonp({
    data: util.genDateValue(6, 20, 60)
  });
});

server.use(router);
server.listen(4001, () => {
  console.log("JSON Server is running on port 4001");
});
