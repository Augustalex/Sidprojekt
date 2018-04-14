const fs = require('fs');

module.exports = function writeFile({ data, path, encoding }) {
    return new Promise((resolve, reject) => {
        fs.writeFile(path, data, encoding, (err) => {
            if (err) {
                reject(err);
            }
            else {
                resolve();
            }
        });
    });
};