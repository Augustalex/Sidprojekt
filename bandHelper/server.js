const https = require('https');
const express = require('express');
const app = express();
const readFile = require('../common/readFile.js');

(async function () {
    app.use(express.static('./dist'));
    app.get('/', () => {
        console.log('someone is requesting a get!');
    });

    let sslOptions = {
        key: await readFile('./ssl.key'),
        cert: await readFile('./ssl.cert')
    }
    https.createServer(sslOptions, app)
        .listen(3000, '0.0.0.0');
}());