let bocha = require('bocha');
let sinon = bocha.sinon;
let defaults = bocha.defaults;
let assert = bocha.assert;
const crypto = require('crypto');
let Store = require('../Store.js');
const fs = require('fs');
const path = require('path');
const testDataPath = path.join(__dirname, '/testData');

module.exports = bocha.testCase('Store', {
    'when store text and get text with id': {
        async setUp() {
            const store = Store({ dataPath: testDataPath });
            const storeId = await store.storeText('ABC');

            this.data = await store.getText(storeId);
        },
        'should get stored text': function () {
            assert.equals(this.data, 'ABC');
        }
    },
    'when store blob and get blob with id': {
        async setUp() {
            const store = Store({ dataPath: testDataPath });
            this.buffer = new Buffer('abc');
            const storeId = await store.storeBinary(this.buffer);

            this.data = await store.getBinary(storeId);
        },
        'should get stored data': function () {
            assert.equals(this.data.toString(), this.buffer.toString());
        }
    },
    'when safeShutdown and loadViews on new store': {
        async setUp() {
            const store = Store({ dataPath: testDataPath });
            this.buffer = new Buffer('abc');
            const storeId = await store.storeBinary(this.buffer);
            await store.safeShutdown();

            const newStore = Store({ dataPath: testDataPath });
            await newStore.loadViews();
            this.data = await newStore.getBinary(storeId);
        },
        'should retain the files of the old store': function () {
            assert.equals(this.data.toString(), this.buffer.toString());
        }
    },
    'when store object of type and get object with id': {
        async setUp() {
            const store = Store({ dataPath: testDataPath });
            this.obj = { test: 'ABC' };
            const storeId = await store.store('test', this.obj);

            this.data = await store.get(storeId);
        },
        'should get parsed object': function () {
            assert.equals(this.data, this.obj);
        }
    },
    'scenario: storing object referring to audio blob': {
        async setUp() {
            this.store = Store({ dataPath: testDataPath });
            this.audioBlob = new Buffer('audio-blob-data');
            let blobId = await this.store.storeBinary(this.audioBlob);
            this.obj = {
                name: 'My audio blob',
                blobId
            };
            const storeId = await this.store.store('audioFile', this.obj);

            this.data = await this.store.get(storeId);
        },
        'should get audioFile': function () {
            assert.equals(this.data, this.obj);
        },
        'can get audioBlob from id in audioFile': async function () {
            let audioBlob = await this.store.getBinary(this.data.blobId);
            assert.equals(audioBlob, this.audioBlob);
        }
    },
});