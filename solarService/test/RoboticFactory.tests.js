let bocha = require('bocha');
let sinon = bocha.sinon;
let testCase = bocha.testCase;
let assert = bocha.assert;
let refute = bocha.refute;
let constructionHierarchy = require('../building/constructionHierarchy.js');
let RoboticFactory = require('../building/RoboticFactory.js');

module.exports = testCase('RoboticFactory', {
    'when construct and have enough minerals should update goods': function () {
        let resourceManager = {
            get: () => ({ minerals: 101, goods: 100 }),
            set: sinon.stub()
        };
        let building = RoboticFactory({
            resourceManager,
            efficiency: 1
        });

        building.construct();

        assert.calledWith(resourceManager.set, 'goods', 101);
    },
    'when construct building and does NOT have enough minerals': {
        async setUp() {
            this.resourceManager = {
                get: () => ({ minerals: 100, goods: 100 }),
                set: sinon.stub()
            };
            let building = RoboticFactory({
                resourceManager: this.resourceManager,
                efficiency: 1
            });

            try {
                building.construct();
            }
            catch (error) {
                this.error = error;
            }
        },
        'should throw error': function () {
            assert.equals(this.error.message, 'Insufficient mineral production');
        },
        'should NOT update resources': function () {
            refute.called(this.resourceManager.set);
        }
    },
    'when ask canConstruct and does NOT have enough minerals should return false': async function () {
        let resourceManager = {
            get: () => ({ minerals: 100, goods: 100 }),
            set: sinon.stub()
        };
        let building = RoboticFactory({
            resourceManager,
            efficiency: 1
        });

        let canConstruct = building.canConstruct();

        refute(canConstruct);
    },
    'when ask canConstruct and have enough minerals should return true': async function () {
        let resourceManager = {
            get: () => ({ minerals: 101, goods: 100 }),
            set: sinon.stub()
        };
        let building = RoboticFactory({
            resourceManager,
            efficiency: 1
        });

        let canConstruct = building.canConstruct();

        assert(canConstruct);
    }
});