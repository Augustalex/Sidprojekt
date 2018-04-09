const runTestsAsync = require('../../common/runTestsAsync.js');
runTestsAsync([
    require('../../common/test/ServiceTest.js')('AuthService', require('../AuthService.js')),
    require('./AuthClient.tests.js'),
    require('./UserController.tests.js')
]);