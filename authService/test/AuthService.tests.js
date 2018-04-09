let bocha = require('bocha');
let sinon = bocha.sinon;
let assert = bocha.assert;
let AuthService = require('../AuthService');

module.exports = bocha.testCase('AuthService', {
    'can start server': {
        async setUp() {
            this.directoryClient = {
                register: sinon.stub(),
                getAll: sinon.stub().returns([])
            };
            this.server = {
                listen: sinon.stub()
            };
            let http = {
                createServer: () => this.server
            };
            this.logger = {
                info: sinon.stub()
            };
            let auth = AuthService({
                directoryClient: this.directoryClient,
                ipUtils: {
                    address: () => '1',
                    getPort: () => Promise.resolve('2')
                },
                logger: this.logger,
                http
            });

            this.url = await auth.start();
        },
        'should register service in directory': function () {
            assert.calledWith(this.directoryClient.register, 'AuthService', '1', '2');
        },
        'should listen at given port': function () {
            assert.calledWith(this.server.listen, '2');
        },
        'should log status': function () {
            assert.calledWith(this.logger.info, 'AuthService:2 [REGISTERED]');
        },
        'should return url': function () {
            assert.equals(this.url, 'http://1:2');
        }
    }
});