let getPort = require('get-port');
let ip = require('ip');

module.exports = {
    getPort,
    address: () => ip.address()
};