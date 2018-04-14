const https = require('https');
const express = require('express');
const app = express();
const path = require('path');
const readRawFile = require('../common/readRawFile.js');
const bodyParser = require('../common/expressBufferBodyParser.js');

(async function () {
    app.use(express.static('./dist'));
    app.get('/', () => {
        console.log('someone is requesting a get!');
    });
    app.use(bodyParser);
    let storedAudio = null;
    app.post('/store', async (req, res) => {
        storedAudio = req.body;
        res.end();
    });
    app.get('/get-sample-audio', async (req, res) => {
        console.log('reading file ... ')
        let file = await readRawFile(path.join(__dirname, './house.wav'));
        console.log('got file', file.length)
        res.end(file, 'binary');
    });

    let sslOptions = {
        key: await readRawFile('./ssl.key'),
        cert: await readRawFile('./ssl.cert')
    }
    https.createServer(sslOptions, app)
        .listen(3000, '0.0.0.0', () => void console.log('listening on port 3000'));
}());