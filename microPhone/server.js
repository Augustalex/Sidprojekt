const https = require('https');
const express = require('express');
const app = express();
const path = require('path');
const readRawFile = require('../common/readRawFile.js');
const writeFile = require('../common/writeFile.js');
const bufferParser = require('../common/expressBufferParser.js');
const SocketIO = require('socket.io');
const SimpleStore = require('../simpleStore/Store.js');
const AudioStore = require('../simpleStore/AudioFacade.js');

const DATA_PATH = path.join(__dirname, 'data');

(async function () {
    const simpleStore = SimpleStore({ dataPath: DATA_PATH });
    const audioStore = AudioStore(simpleStore);
    await audioStore.loadView();
    setInterval(audioStore.saveView, 10000);

    let io;
    app.use(bufferParser);
    app.use(express.static('./mobileClient/dist'));
    app.use(express.static('./desktopClient/dist'));
    app.get('/mobile', async (req, res) => {
        console.log('serving mobile client')
        res.sendFile(path.join(__dirname, '/mobileClient/dist/mobile.html'));
    });
    app.get('/desktop', async (req, res) => {
        console.log('serving desktop client')
        res.sendFile(path.join(__dirname, '/desktopClient/dist/desktop.html'));
    });

    app.get('/audio/:id', async (req, res) => {
        let { buffer } = await audioStore.get(req.params.id);
        res.end(buffer);
    });
    app.get('/audio', async (req, res) => {
        let list = audioStore.list();
        res.json(list);
    });
    app.post('/audio/:name', async (req, res) => {
        const name = req.params.name;
        const buffer = req.buffer;
        let metadata = {
            name,
            byteLength: buffer.byteLength
        }
        const audioId = await audioStore.store(buffer, metadata);
        console.log(`Done storing file: ${name}`, audioId)
        io.emit('audioStored', `/audio/${audioId}`);
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
            socket.broadcast.emit('command', command);
        });
    });
    server.listen(3000, '0.0.0.0', () => void console.log('listening on port 3000'));
}());