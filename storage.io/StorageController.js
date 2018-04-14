const StorageClient = require('./StorageClient.js');

module.exports = function () {

    let storageClient = StorageClient();

    return {
        get,
        store
    };

    async function get(req, res) {
        let data = await storageClient.get(req.params.id);
        if (typeof data === 'object') {
            data = JSON.stringify(data);
        }
        let buffer = new Buffer(data, 'binary');
        res.end(buffer, 'binary');
    }

    async function store(req, res) {
        let id = await storageClient.store(req.body);
        res.end(`${id}`);
    }
};