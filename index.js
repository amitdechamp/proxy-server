#!/usr/bin/env node
// @flow

//This proxy server works with only post requests
//Data must send in json  in the format {options: {}, payload: {}}

const http = require("http");
const https = require("https");
const debug = require("debug")("Proxy");
const PORT = process.argv[2] || 80;

http.createServer(onRequest).listen(PORT);

function onRequest(request, response) {
  debug("Incoming Request");
  let dt = "";

  request.on("data", onData).on("end", onEnd);

  function onData(chunk) {
    dt += chunk;
  }

  function onEnd() {
    //make proxy request

    const data = JSON.parse(dt);
    debug("post data", data.options, data.payload);

    let dat = "";

    const req = https.request(data.options, res => {
      res
        .on("data", chunk => {
          dat += chunk;
          debug("Data %s", chunk + "");
        })
        .on("end", () => {
          debug("Data End %s", dat);
          response.write(dat);
          return response.end();
        })
        .on("error", err => {
          debug("Error %o", err);
        });
    });

    if (data.payload) req.write(data.payload);
    req.end();
  }
}
