let bocha = require('bocha');
let sinon = bocha.sinon;
let testCase = bocha.testCase;
let assert = bocha.assert;
let refute = bocha.refute;
let constructionHierarchy = require('../building/constructionHierarchy.js');
let RoboticMines = require('../building/RoboticMines.js');

module.exports = testCase('RoboticMines', {
    'when constructs should update resources': function () {
        let resourceManager = {
            get: () => ({ minerals: 100 }),
            set: sinon.stub()
        };
        let building = RoboticMines({
            resourceManager,
            efficiency: 1
        });

        building.construct();

        assert.calledWith(resourceManager.set, 'minerals', 101);
    },
    // 'when has enough mineral production and construct factory should increase goods production': function () {
    //     let resourceManager = {
    //         get: {
    //             minerals: 101,
    //             goods: 100,
    //             economy: 100
    //         },
    //         set: sinon.stub()
    //     };
    //     let constructionManager = RoboticMines({ resourceManager });
    //     let building = {
    //         name: constructionHierarchy.constants.ROBOTIC_FACTORY,
    //         efficiency: 1
    //     };
    //
    //     constructionManager.construct(building);
    //
    //     assert.calledWith(resourceManager.set, 'goods', 1);
    // },
    // 'when has enough goods production and construct mega city should increase economy': function () {
    //     let resourceManager = {
    //         get: {
    //             minerals: 101,
    //             goods: 101,
    //             economy: 100
    //         },
    //         set: sinon.stub()
    //     };
    //     let constructionManager = RoboticMines({ resourceManager });
    //     let building = {
    //         name: constructionHierarchy.constants.MEGA_CITY,
    //         efficiency: 1
    //     };
    //
    //     constructionManager.construct(building);
    //
    //     assert.calledWith(resourceManager.set, 'economy', 101);
    // },
    // 'when cannot construct building should throw error': {
    //     async setUp() {
    //         this.constructionManager = {
    //             canConstruct: () => false,
    //             construct: sinon.stub()
    //         };
    //         let planet = RoboticMines({ constructionManager: this.constructionManager });
    //         let building = {
    //             name: constructionHierarchy.constants.ROBOTIC_MINES
    //         };
    //
    //         try {
    //             planet.construct(building);
    //         }
    //         catch (error) {
    //             this.error = error;
    //         }
    //     },
    //     'should throw error': function () {
    //         assert.equals(this.error.message, 'Cannot construct building');
    //     },
    //     'should NOT construct building': function () {
    //         refute.called(this.constructionManager.construct);
    //     }
    // }
});