const fs = require('fs');

module.exports = function writeFile({ data, filePath, encoding }) {
    return new Promise((resolve, reject) => {
        fs.writeFile(filePath, data, encoding, (err) => {
            if (err) {
                reject(err);
            }
            else {
                resolve();
            }
        });
    });
};