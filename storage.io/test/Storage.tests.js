let bocha = require('bocha');
let sinon = bocha.sinon;
let defaults = bocha.defaults;
let assert = bocha.assert;
const crypto = require('crypto');
let Storage = require('../Storage.js');
const fs = require('fs');

module.exports = bocha.testCase('Storage', {
    '=>when store data and get data with id': {
        async setUp() {
            const storage = Storage();
            const storeId = await storage.store('ABC');

            this.data = await storage.get(storeId);
        },
        'should get stored data': function () {
            assert.equals(this.data, 'ABC');
        }
    },
    'when store blob and get blob with id': {
        async setUp() {
            const storage = Storage();
            this.buffer = Buffer('abc');
            const storeId = await storage.store(this.buffer);

            this.data = await storage.get(storeId);
        },
        'should get stored data': function () {
            assert.equals(this.data.toString(), this.buffer.toString());
        }
    }
});