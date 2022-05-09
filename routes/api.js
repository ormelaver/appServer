const express = require('express');

const appsRouter = require('./applications/applications.router');
const api = express.Router();

api.use('/applications', appsRouter);

module.exports = api;