const express = require('express');

const {
    httpGetRelevantApps,
    httpAddInstalledApps
} = require('./applications.controller');

const appsRouter = express.Router();

appsRouter.get('/relevantApplication', httpGetRelevantApps);
appsRouter.post('/installedApps', httpAddInstalledApps);

module.exports = appsRouter;