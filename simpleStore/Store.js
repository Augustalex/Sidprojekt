const readFile = require('../common/fs/readFile.js');
const writeFile = require('../common/fs/writeFile.js');
const path = require('path');
const uuid = require('uuid/v4');

module.exports = function (deps) {

    const dataPath = deps.dataPath;

    let dataView = {};

    return {
        loadViews,
        storeText,
        getText,
        storeBinary,
        getBinary,
        store,
        get,
        safeShutdown
    };

    async function loadViews() {
        let filePath = path.join(dataPath, 'data.view');
        const dataViewJson = await readFile({ filePath, encoding: 'utf8' });
        dataView = JSON.parse(dataViewJson);
    }

    async function storeText(text, existingId) {
        let id = existingId || uuid();

        let filePath = path.join(dataPath, id + '.text');
        dataView[id] = filePath;
        await writeFile({ data: text, filePath, encoding: 'utf8' });
        return id;
    }

    async function getText(id) {
        const file = await readFile({ filePath: dataView[id], encoding: 'utf8' });
        return file;
    }

    async function storeBinary(data, existingId) {
        let id = existingId || uuid();

        let filePath = path.join(dataPath, id + '.binary');
        dataView[id] = filePath;
        await writeFile({ data, filePath, encoding: 'binary' });
        return id;
    }

    async function getBinary(id) {
        const file = await readFile({ filePath: dataView[id], encoding: 'binary' });
        return file;
    }

    async function store(type, object, existingId) {
        let id = existingId || uuid();

        let filePath = path.join(dataPath, id + '.object');
        dataView[id] = filePath;
        await writeFile({
            data: JSON.stringify({ type, object }),
            filePath,
            encoding: 'binary'
        });
        return id;
    }

    async function get(id) {
        if (!dataView[id]) {
            throw new Error('No entry for id');
        }

        const json = await readFile({ filePath: dataView[id], encoding: 'utf8' });
        const { object } = JSON.parse(json);
        return object;
    }

    async function safeShutdown() {
        const data = JSON.stringify(dataView);
        let filePath = path.join(dataPath, 'data.view');
        await writeFile({ data, filePath, encoding: 'utf8' });
    }
};