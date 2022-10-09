const express = require('express');
const app = express();
const config = require('./lib/setting/config').config;
const serverPort = config.serverPort;
const server = require('http').createServer(app);
const serverUse=require('./lib/serverUse');
const companyRestApi = require("./lib/rest_api/company");
const employeesRestApi = require("./lib/rest_api/employees");

console.log('config',config)

serverUse.on(app);
companyRestApi.on(app);
employeesRestApi.on(app);

server.listen(serverPort);
console.log("現在使用" + serverPort + "port");