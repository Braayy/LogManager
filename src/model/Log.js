const mongoose = require('mongoose')

const Log = mongoose.Schema({
    tab: {
        type: String,
        required: true
    },
    level: {
        type: String,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Log', Log)