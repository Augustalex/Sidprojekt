const planetNames = require('./planetNames.json');

module.exports = function () {
    let index = Math.floor(Math.random() * (planetNames.length - 1));
    return planetNames[index];
};