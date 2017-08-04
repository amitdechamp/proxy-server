#!/usr/bin/env node

const http = require('http');
const url = require('url');
const queryString = require('querystring');

const debug = require('debug')('Goro:server');

const PORT = process.argv[2] || 8000;

const getOptions = (req) => {
  const parsed = url.parse(req.url);

  return {

    host: parsed.host,
    port: parsed.port,
    path: parsed.pathname,
    params: parsed.query,
    method: req.method.toUpperCase(),
    headers: req.headers,

  };
};

const proxy = (data, options, resp) => {
  let cont = '';
  const proxy = http.request(options, (res) => {
    res.on('data', (chunk) => {
      cont += chunk;
    })
      .on('error', (err) => {
        console.log('shit wtf', err);
      })
      .on('end', () => {
        resp.writeHead(res.statusCode, res.headers);//
        resp.write(cont);
        resp.end();
      });
  });
  proxy.write(data);
  proxy.end();
};

const onRequest = (req, res) => {
  const options = getOptions(req);

  let data = "";

  const onData = (chunk) => {
    data += chunk;
  };

  const onEnd = () => {
    proxy(data, options, res);
  };

  req.on('data', onData);
  req.on('end', onEnd);
};

http.createServer(onRequest).listen(PORT);

console.log(`PROXY SERVER STARTED ON PORT ${PORT}`);
