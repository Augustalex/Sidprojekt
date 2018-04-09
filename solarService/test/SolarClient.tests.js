let bocha = require('bocha');
let sinon = bocha.sinon;
let testCase = bocha.testCase;
let assert = bocha.assert;
let refute = bocha.refute;
let Solar = require('../Constructor.js');
let SolarClient = require('../SolarClient.js');

module.exports = testCase('SolarClient', {
    'when get planets should return all planets': async function () {
        let service = Solar({
            directoryClient: {
                register(){}
            },
            authClient: {
                verifyUser: () => true
            },
            settings: { log: false }
        });
        let solarServiceUrl = await service.start();
        let client = SolarClient({ solarServiceUrl, player: { name: 'A', pass: 'B' } });

        let planets = await client.getPlanets();

        assert(Array.isArray(planets));
    },
    'when user is valid and settle planet should set owner to player': async function () {
        let service = Solar({
            directoryClient: {
                register(){}
            },
            authClient: {
                verifyUser(name, pass) {
                    return name === 'Agge' && pass === 'ABC';
                }
            },
            settings: {
                log: false
            }
        });
        let solarServiceUrl = await service.start();
        let client = SolarClient({
            solarServiceUrl,
            player: {
                name: 'Agge',
                pass: 'ABC'
            }
        });
        let [firstPlanet] = await client.getPlanets();

        await client.settlePlanet(firstPlanet.name);

        [firstPlanet] = await client.getPlanets();
        assert.equals(firstPlanet.owner, 'Agge');
    },
    'when user is NOT valid and get planets should throw error': async function () {
        let directoryClient = {
            register(){}
        };
        let authClient = {
            verifyUser(name, pass) {
                return name === 'Agge' && pass === 'ABC';
            }
        };
        let service = Solar({
            directoryClient,
            authClient,
            settings: {
                log: false
            }
        });
        let solarServiceUrl = await service.start();
        let client = SolarClient({
            solarServiceUrl,
            player: {
                name: 'Agge',
                pass: 'CBA'
            }
        });

        let error;
        try {
            await client.getPlanets();
        }
        catch (err) {
            error = err;
        }

        assert.equals(error.response.status, 401);
    },
    'when user is valid and settle planet already settled by other player should throw error': async function () {
        let directoryClient = {
            register(){}
        };
        let authClient = {
            verifyUser: () => true
        };
        let service = Solar({
            directoryClient,
            authClient,
            settings: {
                log: false
            }
        });
        let solarServiceUrl = await service.start();
        let client = SolarClient({
            solarServiceUrl,
            player: {
                name: 'Agge',
                pass: 'ABC'
            }
        });
        let [firstPlanet] = await client.getPlanets();

        await client.settlePlanet(firstPlanet.name, 'Bengt');

        let error;
        try {
            await client.settlePlanet(firstPlanet.name, 'Agge');
        }
        catch (err) {
            error = err;
        }

        assert.equals(error.message, 'Already settled');
    },
    'can construct robotic mines on settled planet': async function () {
        let service = Solar({
            directoryClient: {
                register(){}
            },
            authClient: {
                verifyUser(name, pass) {
                    return name === 'Agge' && pass === 'ABC';
                }
            },
            settings: {
                log: false
            }
        });
        let solarServiceUrl = await service.start();
        let client = SolarClient({
            solarServiceUrl,
            player: {
                name: 'Agge',
                pass: 'ABC'
            }
        });
        let [firstPlanet] = await client.getPlanets();
        await client.settlePlanet(firstPlanet.name);

        await client.constructBuildingOnPlanet('Robotic mines', firstPlanet.name);

        [firstPlanet] = await client.getPlanets();
        assert.equals(firstPlanet.resources.minerals, 100);
    },
    'can get all available construction options from settled planet': async function () {
        let service = Solar({
            directoryClient: {
                register(){}
            },
            authClient: {
                verifyUser(name, pass) {
                    return name === 'Agge' && pass === 'ABC';
                }
            },
            settings: {
                log: false
            }
        });
        let solarServiceUrl = await service.start();
        let client = SolarClient({
            solarServiceUrl,
            player: {
                name: 'Agge',
                pass: 'ABC'
            }
        });
        let [firstPlanet] = await client.getPlanets();
        await client.settlePlanet(firstPlanet.name);

        let options = await client.getAllConstructionOptionsOnPlanet(firstPlanet.name);

        assert.equals(options, ['Robotic mines']);
    }
});