const fs = require('fs');

module.exports = function readFile(path) {
    return new Promise((resolve, reject) => {
        fs.readFile(path, 'utf-8', (err, file) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(file);
            }
        });
    });
};