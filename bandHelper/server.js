const https = require('https');
const express = require('express');
const app = express();
const readFile = require('../common/readFile.js');
const StorageController = require('../storage.io/StorageController.js');
const bodyParser = require('../common/expressBufferBodyParser.js');

(async function () {
    await require('../storage.io/main.js');
    const storageController = StorageController();
    app.use(express.static('./dist'));
    app.get('/', () => {
        console.log('someone is requesting a get!');
    });
    app.use(bodyParser);
    app.get('/data/:id', storageController.get);
    app.post('/data', storageController.store);

    let sslOptions = {
        key: await readFile('./ssl.key'),
        cert: await readFile('./ssl.cert')
    }
    https.createServer(sslOptions, app)
        .listen(3000, '0.0.0.0');
}());