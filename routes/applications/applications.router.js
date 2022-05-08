const express = require('express');

const {
    httpGetRelevantApps,
    httpAddInstalledApps
} = require('./applications.controller');

const appsRouter = express.Router();

appsRouter.get('/relevantapplication', httpGetRelevantApps);
appsRouter.post('/installedapps', httpAddInstalledApps);

module.exports = appsRouter;