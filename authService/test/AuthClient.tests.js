let bocha = require('bocha');
let sinon = bocha.sinon;
let testCase = bocha.testCase;
let assert = bocha.assert;
let refute = bocha.refute;
let Auth = require('../Constructor.js');
let AuthClient = require('../AuthClient.js');

module.exports = testCase('AuthClient', {
    'when register user should get 200 OK response and pass back': async function () {
        let directoryClient = {
            register(){}
        };
        let service = Auth({
            directoryClient,
            settings: {
                log: false
            }
        });
        let url = await service.start();
        let client = AuthClient({
            authServiceUrl: url
        });

        let pass = await client.registerUser('Agge');

        assert.equals(typeof pass, 'string');
        assert(pass.length > 0);
    },
    'when register user with name already taken should get error': async function () {
        let directoryClient = {
            register(){}
        };
        let service = Auth({
            directoryClient,
            settings: {
                log: false
            }
        });
        let url = await service.start();
        let client = AuthClient({
            authServiceUrl: url
        });
        await client.registerUser('Agge');

        let error;
        try {
            await client.registerUser('Agge');
        }
        catch (err) {
            error = err;
        }

        assert.equals(error.message, 'Name already taken');
    },
    'when verifying registered user with CORRECT pass should return true': async function () {
        let directoryClient = {
            register(){}
        };
        let service = Auth({
            directoryClient,
            settings: {
                log: false
            }
        });
        let url = await service.start();
        let client = AuthClient({
            authServiceUrl: url
        });
        let pass = await client.registerUser('Agge');

        let result = await client.verifyUser('Agge', pass);

        assert.equals(result, true);
    },
    'when verifying a user NOT registered should return false': async function () {
        let directoryClient = {
            register(){}
        };
        let service = Auth({
            directoryClient,
            settings: {
                log: false
            }
        });
        let url = await service.start();
        let client = AuthClient({
            authServiceUrl: url
        });

        let result = await client.verifyUser('Agge');

        assert.equals(result, false);
    },
    'when verifying registered user with WRONG pass should return false': async function () {
        let directoryClient = {
            register(){}
        };
        let service = Auth({
            directoryClient,
            settings: {
                log: false
            }
        });
        let url = await service.start();
        let client = AuthClient({
            authServiceUrl: url
        });
        await client.registerUser('Agge');

        let result = await client.verifyUser('Agge', 'this_is_the_wrong_pass');

        assert.equals(result, false);
    }
});