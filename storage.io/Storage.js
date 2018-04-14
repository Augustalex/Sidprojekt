const readRawFile = require('../common/readRawFile.js');
const writeFile = require('../common/writeFile.js');
const path = require('path');
const fs = require('fs');

let nextId = 1;
const dataDirectory = './data';

module.exports = function () {

    return {
        store,
        get
    };

    async function store(data) {
        if (nextId === 0) {
            await clearData();
        }

        const id = nextId++;
        const fileName = `${id}.data`;
        await writeFile({
            data,
            path: path.join(__dirname, dataDirectory, fileName),
            encoding: 'utf8'
        });
        return id;
    }

    async function get(id) {
        const fileName = `${id}.data`;
        const filePath = path.join(__dirname, dataDirectory, fileName);
        let data = await readRawFile(filePath)
        return data;
    }
};

function clearData() {
    return new Promise((resolve, reject) => {
        fs.readdir(path.join(__dirname, dataDirectory), (err, files) => {
            if (err) return void reject(err);

            for (const file of files) {
                fs.unlink(path.join(path.join(__dirname, dataDirectory), file), err => {
                    if (err) return void reject(err);
                    resolve();
                });
            }
        });
    });
}