const { getRelevantApps,
        addInstalledApp
 } = require('../../models/applications.model');

async function httpGetRelevantApps(req, res) {
    const userAge = req.query.age;
    const category = req.query.category;
    const customerType = req.query.customertype;

    if (!userAge || !category || !customerType) {
        return res.status(400).json({
            message: 'missing at least one parameter'
        });
    }
    
    try {
        const relevantApps = await getRelevantApps(userAge, category, customerType);
        return res.status(200).json(relevantApps);
    } catch (err) {
        return res.status(400).json({
            message: err.message
        })
    }
    
}

async function httpAddInstalledApps(req, res) {
    const installedApp = req.body;
    const userAge = installedApp.age;
    const installedAppName = installedApp.installedapp;

    if (!userAge || !installedAppName) {
        return res.status(400).json({
            message: 'missing at least one parameter'
        });
    }
    if (!Number.isInteger(userAge)) {
        return res.status(400).json({
            message: 'age parameter is not an Int'
        });
    }
    try {
        const updatedApp = await addInstalledApp(installedApp);
        return res.status(201).json({
            updated: true,
            updatedObj: updatedApp
        });
    } catch (err) {
        return res.status(404).json({
            message: err.message
        });
    }

    
}

module.exports = {
    httpGetRelevantApps,
    httpAddInstalledApps
}