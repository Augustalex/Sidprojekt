let PlanetController = require('./PlanetController.js');
let parseUrl = require('../../common/parseUrl.js');

module.exports = function (deps) {

    let planetRepository = deps.planetRepository;
    let controllerWrapper = deps.controllerWrapper;

    let planetControllerByPlanetName = {};

    init();

    return {
        handle
    };

    function init() {
        for (let planet of planetRepository.getPlanets()) {
            let controller = PlanetController({
                planetName: planet.name,
                planetRepository
            });
            planetControllerByPlanetName[planet.name] = controllerWrapper(controller)
        }
    }

    function handle(req, res) {
        if (!req.url.startsWith('/planet')) return;

        let { path: wholePath } = parseUrl(req.url);
        let path = wholePath.slice('/planet'.length);
        let [encodedPlanetName, action] = path.split('/').filter(s => s.length > 0);
        let planetName = decodeURIComponent(encodedPlanetName);
        let controller = planetControllerByPlanetName[planetName];
        if (!controller) {
            throw new Error(`Controller for planet "${planetName}" not found`);
        }

        if (action === 'construction-options') {
            controller.getAllConstructionOptions(req, res);
        }
        else if (action === 'construct-building') {
            controller.constructBuilding(req, res);
        }
    }
};