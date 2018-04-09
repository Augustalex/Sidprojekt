const SolarService = require('./SolarService.js');
const http = require('http');
const ipUtils = require('../common/ipUtils.js');
const logger = require('../common/logger.js');
const PlanetRepository = require('./PlanetRepository.js');
const PlanetRouter = require('./planet/PlanetRouter.js');
const SystemController = require('./SystemController.js');
const wrapController = require('../common/wrapController.js');
const bodyParser = require('../common/bodyParser.js');
const jsonSender = require('../common/jsonSender.js');
const authenticateUser = require('../common/authenticateUser.js');
const controllerPlugins = [bodyParser, jsonSender, authenticateUser];

const NULL_LOGGER = { info(){}, error(){} };

module.exports = function (deps) {

    let settings = deps.settings || {};
    let directoryClient = deps.directoryClient;
    let authClient = deps.authClient;

    let planetRepository = PlanetRepository();
    let systemController = SystemController({
        authClient,
        planetRepository
    });
    let controllerWrapper = controller => wrapController(controller, controllerPlugins, { authClient });
    planetRouter = PlanetRouter({ planetRepository, controllerWrapper });
    systemController = controllerWrapper(systemController);
    // planetController = wrapController(systemController, controllerPlugins, { authClient });
    let solarService = SolarService({
        ipUtils,
        logger: settings.log ? logger : NULL_LOGGER,
        http,
        systemController,
        planetRouter,
        directoryClient
    });

    return {
        start: solarService.start
    };
};