const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/log-manager', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

const express = require('express')
const app = express()

const routes = require('./routes')

app.use(express.json())
app.use(express.static('public'))

app.use(routes)

app.listen(8000, () => console.log('running at 8000'))