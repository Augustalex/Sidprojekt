const Storage = require('./Storage.js');
const express = require('express');
const app = express();
const bodyParser = require('../common/expressBufferBodyParser.js');

const runningPromise = new Promise(async resolve => {
    app.use(bodyParser);
    const storage = Storage();
    app.post('/', async (req, res) => {
        let id = await storage.store(req.body);
        res.end(`${id}`);
    });
    app.get('/:id', async (req, res) => {
        const data = await storage.get(req.params.id);
        res.end(data, 'binary');
    });
    app.listen(2999, () => {
        console.log('Storage service running')
        resolve();
    });
});
module.exports = runningPromise;