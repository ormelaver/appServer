const fetch = require('node-fetch');
const appsDB = require('./applications.mongo');

const RANDOM_NUM_API = 'https://www.random.org/integers/?num=1&min=1&max=5&col=1&base=10&format=plain&rnd=new';

const TYPES = [
                {   
                    name: 'bronze',
                    appsToReturn: 2
                },
                {   
                    name: 'silver',
                    appsToReturn: 2 //default in case the API call will fail
                },  
                { 
                    name: 'gold',  
                    appsToReturn: 2
                }
            ]; 



async function getRelevantApps(userAge, category, customerType) {
    const verifiedType = TYPES.find(type => type.name === customerType);
    if (!verifiedType){
        return;
    }
    let rankedApps = [];
    const appFilter = {
        category: category
    };
    switch (customerType) {
        case 'bronze':
            rankedApps = await getRandomApps(verifiedType.appsToReturn, appFilter);
            break;
        case 'silver':
            const numFromAPI = await getFromExternalAPI(RANDOM_NUM_API);
            if (Number.isInteger(numFromAPI)){
                rankedApps = await getRandomApps(numFromAPI, appFilter);
            } else {
                console.log('Error fetching number of apps. Fetching 2 as default.', numFromAPI.error);
                rankedApps = await getRandomApps(verifiedType.appsToReturn, appFilter);
            }
            break;
        case 'gold':
            rankedApps = await rankAppsByAverageAge(verifiedType.appsToReturn, appFilter, Number(userAge));
            break;
    }

    // console.log('rankedapps', rankedApps)
    return rankedApps;
}

async function getRandomApps(numOfAppsToReturn, filter) {
    const apps = await getAppsByFilter(filter);
    const appsShuffled = shuffleArray(apps).slice(0, numOfAppsToReturn);
    return appsShuffled;
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}

async function getFromExternalAPI(url) {
    try {
        const response = await fetch(url);
        const num = await response.json()
        return num;
    } catch (err) {
        return {
            error: err
        }
    }
}

async function getAppsByFilter(filter) {
    return await appsDB.find(filter);
}

async function findOneApp(filter) {
    return await appsDB.findOne(filter);
}

async function updateOne(filter, newValues) {
    return await appsDB.findOneAndUpdate(filter, newValues, { //use findOneAndReplace? because we're doing a POST and not a PUT
        new: true
    });
}
async function addInstalledApp(appObj) {
    const filter = {
        name: appObj.installedapp
    }
    const installedApp = await findOneApp(filter);
    if (!installedApp) {
        return;
    }

    const newAverageAge = calculateAverageUserAge(installedApp.numOfInstalls, installedApp.age, appObj.age);
    const newAverageObj = {
        age: newAverageAge,
        numOfInstalls: installedApp.numOfInstalls + 1
    }
    const updatedApp = await updateOne(filter, newAverageObj)
    return updatedApp
}

function calculateAverageUserAge(numOfInstalls, currentAverage, newAge) {
    const newTotalAge = numOfInstalls * currentAverage + newAge;

    return Math.round(newTotalAge / (numOfInstalls + 1)); 
}

async function rankAppsByAverageAge(numOfAppsToReturn, filter, userAge) {
    const appsByAge = await appsDB.aggregate([
        {$match: filter},

        {$project: {diff: {$abs: {$subtract: [userAge, '$age']}}, doc: '$$ROOT', '_id': 0}},

        {$sort: {diff: 1}},

        {$limit: numOfAppsToReturn}
    ]);
    return appsByAge;
}

module.exports = {
    getRelevantApps,
    addInstalledApp
}