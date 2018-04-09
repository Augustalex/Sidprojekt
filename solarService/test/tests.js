const runTestsAsync = require('../../common/runTestsAsync.js');
runTestsAsync([
    require('../../common/test/ServiceTest.js')('SolarService', require('../SolarService.js')),
    require('./SystemController.tests.js'),
    require('./SolarClient.tests.js'),
    require('./Planet.tests.js'),
    require('./RoboticMines.tests.js'),
    require('./RoboticFactory.tests.js'),
]);