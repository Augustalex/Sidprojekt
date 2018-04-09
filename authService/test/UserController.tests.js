let bocha = require('bocha');
let sinon = bocha.sinon;
let defaults = bocha.defaults;
let assert = bocha.assert;
let UserController = require('../UserController');

module.exports = bocha.testCase('UserController', {
    'when register new user': {
        async setUp() {
            let userController = UserController({
                uuid: () => '123'
            });
            let req = {
                body: {
                    name: 'Kent'
                }
            };
            this.res = {
                writeHead: sinon.stub(),
                end: sinon.stub()
            };

            userController.registerUser(req, this.res);
        },
        'should end with 200': function () {
            assert.calledWith(this.res.writeHead, 200);
        },
        'should end with new pass': function () {
            assert.calledWith(this.res.end, '123');
        }
    },
    'when register user with name already taken': {
        async setUp() {
            let userController = UserController({
                uuid: () => '123'
            });
            userController.registerUser({ body: { name: 'Kent' } }, createRes());
            this.res = createRes({
                writeHead: sinon.stub(),
                end: sinon.stub()
            });

            userController.registerUser({ body: { name: 'Kent' } }, this.res);
        },
        'should end with 403': function () {
            assert.calledWith(this.res.writeHead, 403);
        },
        'should end': function () {
            assert.calledOnce(this.res.end);
        }
    },
    'when login with correct pass': {
        async setUp() {
            let userController = UserController({
                uuid: () => 'ABC'
            });
            this.res = createRes({
                writeHead: sinon.stub(),
                end: sinon.stub()
            });
            userController.registerUser({ body: { name: 'Kent' } }, createRes());

            userController.verifyUser({ url: '/Kent/ABC' }, this.res);
        },
        'should end with 200': function () {
            assert.calledWith(this.res.writeHead, 200);
        },
        'should pass verification': function () {
            assert.calledWith(this.res.end, 'pass');
        }
    },
    'when login with incorrect pass': {
        async setUp() {
            let userController = UserController({
                uuid: () => 'ABC'
            });
            this.res = createRes({
                writeHead: sinon.stub(),
                end: sinon.stub()
            });
            userController.registerUser({ body: { name: 'Kent' } }, createRes());

            userController.verifyUser({ url: '/Kent/CBA' }, this.res);
        },
        'should end with 200': function () {
            assert.calledWith(this.res.writeHead, 200);
        },
        'should fail verification': function () {
            assert.calledWith(this.res.end, 'fail');
        }
    },
});

function createRes(res = {}) {
    return defaults(res, {
        writeHead(){},
        end(){}
    });
}