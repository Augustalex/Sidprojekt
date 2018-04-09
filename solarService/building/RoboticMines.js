const buildingConstants = require('./buildingConstants.js');
const constructionHierarchy = require('./constructionHierarchy.js');
const DEFAULT_EFFICIENCY = 100;

module.exports = RoboticMines;

function RoboticMines(deps) {

    let efficiency = deps.efficiency || DEFAULT_EFFICIENCY;
    let resourceManager = deps.resourceManager;
    return {
        name: buildingConstants.ROBOTIC_MINES,
        canConstruct: () => true,
        construct
    };

    function construct() {
        let resources = resourceManager.get();
        resources.minerals += efficiency;
        resourceManager.set('minerals', resources.minerals);
    }
}