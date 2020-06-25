import http from "http";
import finalhandler from "finalhandler";
import serveStatic from "serve-static";

const serve = serveStatic("docs", { "index": ["index.html"] });

const server = http.createServer((req, res) => {
  serve(req, res, finalhandler(req, res))
})

const port = process.env.PORT || 1337;
server.listen(port);

console.log("Server running at http://localhost:%d", port);
