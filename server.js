import http from "http";
import finalhandler from "finalhandler";
import serveStatic from "serve-static";

const serve = serveStatic("docs", { "index": ["index.html"] });

const server = http.createServer((req, res) => {
  res.setHeader("x-content-type-options", "nosniff");
  res.setHeader("x-xss-protection", "1; mode=block");
  res.setHeader("x-frame-options", "DENY");
  res.setHeader("strict-transport-security", "max-age=31536000; includeSubDomains; preload");
  res.setHeader("referrer-policy", "no-referrer");
  serve(req, res, finalhandler(req, res))
})

const port = process.env.PORT || 1337;
server.listen(port);

console.log("COVID-19 signage server running at http://localhost:%d", port);
