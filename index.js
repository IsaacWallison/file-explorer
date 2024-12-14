const http = require("http");

const respond = require("./lib/respond");

const PORT = process.env.PORT || 5000;

const server = http.createServer(respond);

server.listen(PORT, () => {
  console.log(`Listening on port : ${PORT}`);
});
