const mongoose = require('mongoose');

const appsSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    numOfInstalls : {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model('Application', appsSchema);