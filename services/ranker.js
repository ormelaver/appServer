const axios = require('axios');
const TYPES = ['bronze', 'silver', 'gold'];
const RANDOM_NUM_API = 'https://www.random.org/integers/?num=1&min=1&max=5&col=1&base=10&format=plain&rnd=new';

async function rankByCustomerType(age, type, apps) {
    return new Promise(async (resolve, reject) => {
        if (!TYPES.includes(type)){
            reject('unidentified customer type');
        }
        let rankedApps = [];
        switch (type) {
            case 'bronze':
                rankedApps = rankByTypeBronzeSilver(apps, 2);
            case 'silver':
                const randomNumObject = await axios.get(RANDOM_NUM_API);
                console.log('random number from API:', randomNumObject.data);
                rankedApps = rankByTypeBronzeSilver(apps, randomNumObject.data);
            case 'gold':
        }
        resolve(rankedApps);

    });
}

function rankByTypeGold(apps, )

function rankByTypeBronzeSilver(apps, numOfAppsToReturn) {
    if (apps.length === 0) {
        return apps;
    }
    return shuffleArray(apps).slice(0, numOfAppsToReturn);
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

module.exports = {
    rankByCustomerType
}