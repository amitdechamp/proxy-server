# README #

Tiny and fast proxy server for axios based requests

All requests must be post request using axios format

SETUP
===

### Option 1

- cd proxy-server
- npm install
- npm install -g pm2
- npm start [port]  #default port is 80

### Option 2

- curl https://goo.gl/3ZBFec | bash


STOPING SERVER
===

- pm2 kill

STARTING SERVER WITH A DIFFERENT PORT
===

- npm start 8000
