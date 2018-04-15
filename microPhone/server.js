const https = require('https');
const express = require('express');
const app = express();
const path = require('path');
const readRawFile = require('../common/readRawFile.js');
const writeFile = require('../common/writeFile.js');
const bufferParser = require('../common/expressBufferParser.js');
const SocketIO = require('socket.io');

(async function () {
    let io;
    app.use(bufferParser);
    app.use(express.static('./mobileClient/dist'));
    app.use(express.static('./desktopClient/dist'));
    app.get('/mobile', async (req, res) => {
        res.sendFile(path.join(__dirname, '/mobileClient/dist/mobile.html'));
    });
    app.get('/desktop', async (req, res) => {
        res.sendFile(path.join(__dirname, '/desktopClient/dist/desktop.html'));
    });
    app.get('/audio/:name', async (req, res) => {
        let audioUrl = path.join(__dirname, `/audio/${req.params.name}.wav`);
        res.sendFile(audioUrl);
    });
    app.post('/audio/:name', async (req, res) => {
        const name = req.params.name;
        const buffer = req.buffer;
        const filePath = path.join(__dirname, 'audio', name + '.wav');
        await writeFile({ data: buffer, path: filePath, encoding: 'binary' });
        console.log(`Done writing file: ${name}`)
        io.emit('audioUrl', `/audio/${name}`);
        res.end();
    });

    const sslOptions = {
        key: await readRawFile('./ssl.key'),
        cert: await readRawFile('./ssl.cert')
    }
    const server = https.createServer(sslOptions, app);
    io = SocketIO(server);
    io.on('connection', socket => {
        socket.on('command', command => {
            console.log('broadcasting ', command)
            socket.broadcast.emit('command', command);
        });
    });
    server.listen(3000, '0.0.0.0', () => void console.log('listening on port 3000'));
}());