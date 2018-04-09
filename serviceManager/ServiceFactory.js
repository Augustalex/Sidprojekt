let Auth = require('../authService/Constructor.js');
let DynamicAuthClient = require('../authService/DynamicAuthClient.js');
let Solar = require('../solarService/Constructor.js');

module.exports = function (deps) {

    let directoryClient = deps.directoryClient;

    let authClient = DynamicAuthClient({ directoryClient });

    return {
        createAuthService,
        createSolarService
    };

    function createAuthService() {
        return Auth({ directoryClient });
    }

    function createSolarService() {
        return Solar({
            directoryClient,
            authClient
        });
    }
};