const fs = require('fs');

module.exports = function readRawFile(path) {
    return new Promise((resolve, reject) => {
        fs.readFile(path, (err, file) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(file);
            }
        });
    });
};