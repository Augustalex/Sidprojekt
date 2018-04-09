let bocha = require('bocha');
let sinon = bocha.sinon;
let testCase = bocha.testCase;
let assert = bocha.assert;
let refute = bocha.refute;
let SystemController = require('../SystemController.js');
let ResourceManager = require('../planet/ResourceManager.js');
let Planet = require('../planet/Planet.js');

module.exports = testCase('SystemController', {
    'when getPlanets should return all planets from repository': function () {
        let planet = Planet({
            resourceManager: ResourceManager(),
            name: 'Tellus'
        });
        let controller = SystemController({
            planetRepository: {
                getPlanets: () => [planet]
            }
        });
        let res = { json: sinon.stub() };

        controller.getPlanets({ query: {} }, res);

        assert.calledWith(res.json, [{
            name: 'Tellus',
            owner: '',
            resources: {
                minerals: 0,
                goods: 0,
                economy: 0
            }
        }]);
    },
    'when valid player settle planet should set player as owner of planet': {
        async setUp() {
            this.planet = { name: 'Tellus', setOwner: sinon.stub(), getOwner() {} };
            this.planetRepository = {
                getPlanets: () => [this.planet],
                setPlanets: sinon.stub()
            };
            let controller = SystemController({
                planetRepository: this.planetRepository,
                authClient: {
                    async verifyUser(name, pass) {
                        return name === 'Agge' && pass === 'ABC';
                    }
                }
            });
            this.res = { end: sinon.stub() };

            await controller.settlePlanet({
                body: {
                    player: {
                        name: 'Agge',
                        pass: 'ABC'
                    },
                    planetName: 'Tellus'
                }
            }, this.res);
        },
        'should call res end': function () {
            assert.calledOnce(this.res.end);
        },
        'should set player as owner of planet': function () {
            assert.calledWith(this.planet.setOwner, 'Agge');
        }
    }
});