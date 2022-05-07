const { getRelevantApps,
        addInstalledApp
 } = require('../../models/applications.model');

async function httpGetRelevantApps(req, res) {
    const userAge = req.query.age;
    const category = req.query.category;
    const customerType = req.query.customertype;

    if (!userAge || !category || !customerType) {
        return res.status(400).json({
            error: 'missing at least one parameter'
        });
    }
    
    
    const relevantApps = await getRelevantApps(userAge, category, customerType);
    if (!relevantApps) {
        return res.status(404).json({
            error: 'customer type not found'
        });
    }

    if (relevantApps.length === 0) {
        return res.status(400).json({
            error: 'invalid app category'
        })
    }
    return res.status(200).json(relevantApps);
}

async function httpAddInstalledApps(req, res) {
    const installedApp = req.body;
    const userAge = installedApp.age;
    const installedAppName = installedApp.installedapp;

    if (!userAge || !installedAppName) {
        return res.status(400).json({
            error: 'missing at least one parameter'
        });
    }
    if (!Number.isInteger(userAge)) {
        return res.status(400).json({
            error: 'age parameter is not an Int'
        });
    }
    const updatedApp = await addInstalledApp(installedApp);
    if (!updatedApp) {
        return res.status(404).json({
            error: 'no matching app found'
        });
    }
    return res.status(201).json({
        updated: true,
        updatedObj: updatedApp
    });
}

module.exports = {
    httpGetRelevantApps,
    httpAddInstalledApps
}