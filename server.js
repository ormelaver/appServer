const https = require('https');
const fs = require('fs');
const path = require('path');

const app = require('./app');
const { mongoConnect } = require('./services/mongo');

require('dotenv').config();
const PORT = process.env.PORT || 8000

const server = https.createServer({
    key: fs.readFileSync(path.join(__dirname, 'key.pem')),
    cert: fs.readFileSync(path.join(__dirname, 'cert.pem'))
}, app);



async function startServer() {
    await mongoConnect();
    server.listen(PORT, () => {
        console.log(`listening on port ${PORT}`);
    });
}

startServer();