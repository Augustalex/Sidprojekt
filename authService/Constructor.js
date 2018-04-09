const AuthService = require('./AuthService.js');
const http = require('http');
const ipUtils = require('../common/ipUtils.js');
const logger = require('../common/logger.js');
const UserController = require('./UserController.js');
const uuid = require('uuid/v1');
const wrapController = require('../common/wrapController.js');
const bodyParser = require('../common/bodyParser.js');
const jsonSender = require('../common/jsonSender.js');
const controllerPlugins = [bodyParser, jsonSender];

const NULL_LOGGER = { info(){}, error(){} };

module.exports = function (deps) {

    let settings = deps.settings || {};
    let directoryClient = deps.directoryClient;

    let userController = UserController({ uuid });
    userController = wrapController(userController, controllerPlugins);
    let authService = AuthService({
        ipUtils,
        logger: settings.log ? logger : NULL_LOGGER,
        http,
        userController,
        directoryClient
    });

    return {
        start: authService.start
    };
};