let AuthClient = require('./AuthClient.js');

module.exports = function (deps) {

    let directoryClient = deps.directoryClient;
    let authClient;

    return new Proxy({}, {
        get(target, key, receiver) {
            return new Proxy(function () {}, {
                apply(target, thisArg, argumentList){
                    if (!authClient) {
                        return setupAuthClient()
                            .then(() => authClient[key](...argumentList))
                            .catch(err => {
                                console.error(err.message);
                            });
                    }
                    return authClient[key](...argumentList);
                }
            });
        }
    });

    async function setupAuthClient() {
        let [authServiceUrl] = await directoryClient.search({ type: 'AuthService' });
        if (authServiceUrl) {
            authClient = AuthClient({ authServiceUrl });
        }
        else {
            throw new Error('No AuthService running, cannot setup AuthClient.');
        }
    }
};