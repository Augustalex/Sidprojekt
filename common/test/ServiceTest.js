let bocha = require('bocha');
let sinon = bocha.sinon;
let assert = bocha.assert;

module.exports = function (serviceName, ServiceConstructor) {
    return bocha.testCase(serviceName, {
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
                let service = ServiceConstructor({
                    directoryClient: this.directoryClient,
                    ipUtils: {
                        address: () => '1',
                        getPort: () => Promise.resolve('2')
                    },
                    logger: this.logger,
                    http
                });

                await service.start();
            },
            'should register service in directory': function () {
                assert.calledWith(this.directoryClient.register, serviceName, '1', '2');
            },
            'should listen at given port': function () {
                assert.calledWith(this.server.listen, '2');
            },
            'should log status': function () {
                assert.calledWith(this.logger.info, serviceName + ':2 [REGISTERED]');
            }
        }
    });
};