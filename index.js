#!/usr/bin/env node

// @flow

const http = require("http");
const axios = require("axios");

const debug = require("debug")("proxy");

const PORT = process.argv[2] || 8000;

http.createServer(onRequest).listen(PORT);

process.stdout.write(`PROXY SERVER STARTED ON PORT ${PORT}`);

//============================================================

var proxy = (data, resp) => {
  var onProxyRes = res => {
    resp.write(res);
    return resp.end();
  };

  var x = axios(data);

  x.then(res => onProxyRes(JSON.stringify(res.data))).catch(onProxyRes);
};

var onRequest = (req, res) => {
  req.on("data", onData);
  req.on("end", onEnd);

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

  var onData = chunk => {
    data += chunk;
  };

  var onEnd = () => proxy(JSON.parse(data), res);
};
