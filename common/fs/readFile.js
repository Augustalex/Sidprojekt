const fs = require('fs');

module.exports = function readFile({ filePath, encoding }) {
    return new Promise((resolve, reject) => {
        if (encoding === 'binary') {
            fs.readFile(filePath, (err, file) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(file);
                }
            });
        }
        else {
            fs.readFile(filePath, encoding, (err, file) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(file);
                }
            });
        }
    });
};