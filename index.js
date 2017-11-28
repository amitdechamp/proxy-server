#!/usr/bin/env node

// @flow

const http = require("http");
const axios = require("axios");

const debug = require("debug")("proxy");

const PORT = process.argv[2] || 1991;

const proxy = (data, resp) => {
  const onProxyRes = res => {
    resp.write(res);
    return resp.end();
  };

  const x = axios(data);
  x.then(res => onProxyRes(JSON.stringify(res.data))).catch(onProxyRes);
};

const onRequest = (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Request-Method", "*");
  res.setHeader("Access-Control-Allow-Methods", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );

  if (req.method === "OPTIONS") {
    res.writeHead(200);
    res.end();
    return;
  }

  let data = "";

  const onData = chunk => {
    data += chunk;
  };

  const onEnd = () => proxy(JSON.parse(data), res);

  req.on("data", onData);
  req.on("end", onEnd);
};

var serverStarted = false;

function startServer(port) {
  var serverPort = port || PORT;
  http.createServer(onRequest).listen(serverPort);
  process.stdout.write(`PROXY SERVER STARTED ON PORT ${serverPort}`);
}

module.exports = function(port) {
  startServer(port);
};

setTimeout(() => {
  if (serverStarted) return;
  startServer();
}, 1000);
