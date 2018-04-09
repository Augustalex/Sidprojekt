let axios = require('axios');

module.exports = function (deps) {

    let directoryClient = deps.directoryClient;

    return {
        start
    };

    async function start() {
        await directoryClient.register('hello', '0.0.0.0', '3001');
        let data = await directoryClient.getAll();
        console.log(data);
    }
};