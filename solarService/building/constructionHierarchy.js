const buildings = require('./buildingConstants.js');

module.exports = {
    [buildings.ROBOTIC_MINES]: {
        file: require('./RoboticMines.js'),
        unlocks: [
            buildings.ROBOTIC_FACTORY
        ]
    },
    [buildings.ROBOTIC_FACTORY]: {
        file: require('./RoboticFactory.js'),
        unlocks: [
            buildings.MEGA_CITY
        ]
    },
    // [buildings.MEGA_CITY]: {
    //     file: require('./RoboticFactory.js'),
    //     unlocks: [
    //         buildings.SPACE_STATION
    //     ]
    // }
};