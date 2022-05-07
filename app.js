const express = require('express');
const api = require('./routes/api');
const helmet = require('helmet');

const app = express();

app.use(helmet());

app.use(express.json());

app.use('/', api);
module.exports = app;