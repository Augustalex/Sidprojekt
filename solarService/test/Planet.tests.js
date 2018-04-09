let bocha = require('bocha');
let sinon = bocha.sinon;
let testCase = bocha.testCase;
let assert = bocha.assert;
let refute = bocha.refute;
let Planet = require('../planet/Planet.js');

module.exports = testCase('Planet', {
    'can list all available construction options': function () {
        let planet = Planet({
            resourceManager: {
                get: () => ({
                    minerals: 0,
                    goods: 0
                })
            }
        });

        let options = planet.getAllConstructionOptions();

        assert.equals(options, [
            'Robotic mines'
        ]);
    },
    'when get all available construction options and can build factory should include factory': function () {
        let planet = Planet({
            resourceManager: {
                get: () => ({
                    minerals: 100,
                    goods: 0
                })
            }
        });

        let options = planet.getAllConstructionOptions();

        assert.equals(options, [
            'Robotic mines',
            'Robotic factory'
        ]);
    }
});