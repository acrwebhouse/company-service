const express = require('express');
const app = express();
const config = require('./lib/setting/config').config;
const serverPort = config.serverPort;
const server = require('http').createServer(app);
const serverUse=require('./lib/serverUse');
const userRestApi = require("./lib/rest_api/user");
const notificationRestApi = require("./lib/rest_api/notification");

console.log('config',config)

serverUse.on(app);
userRestApi.on(app);
notificationRestApi.on(app);

server.listen(serverPort);
console.log("現在使用" + serverPort + "port");