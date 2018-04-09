const generatePlanetName = require('../planetNameGenerator/generatePlanetName.js');
const Planet = require('./Planet.js');
const ResourceManager = require('./ResourceManager.js');

module.exports = {
    create() {
        let name = generatePlanetName();
        let resourceManager = ResourceManager();
        return Planet({
            name,
            resourceManager
        });
    }
};