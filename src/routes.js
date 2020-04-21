const { Router } = require('express')

const Log = require('./model/Log')

const router = Router()

router.get('/', (req, res) => res.sendFile('index.html'))

router.get('/logs', async (req, res) => {
    try {
        const logs = await Log.find()
        
        res.json(logs)
    } catch (exception) {
        res.status(500).send('Something got wrong')
        throw exception
    }
})

router.post('/logs', async (req, res) => {
    try {
        const { tab, level, time, content } = req.body

        await Log.create({ tab, level, time, content })

        res.send()
    } catch (exception) {
        res.status(500).send('Something got wrong')
        throw exception
    }
})

router.put('/logs', async (req, res) => {
    try {
        const { tab } = req.query

        await Log.deleteMany({ tab })

        res.send()
    } catch (exception) {
        res.status(500).send('Something got wrong')
        throw exception
    }
})

module.exports = router