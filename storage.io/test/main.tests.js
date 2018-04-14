let bocha = require('bocha');
let sinon = bocha.sinon;
let defaults = bocha.defaults;
let assert = bocha.assert;
const StorageClient = require('../StorageClient.js');

module.exports = bocha.testCase('Storage', {
    async setUp() {
        await require('../main.js');
    },
    'can store and get stored data': {
        async setUp() {
            let storageClient = StorageClient();
            let id = await storageClient.store('ABC');

            this.data = await storageClient.get(id);
        },
        'should get stored data': function () {
            assert.equals(this.data, 'ABC');
        }
    }
});