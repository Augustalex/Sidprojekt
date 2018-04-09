const buildingConstants = require('./buildingConstants.js');
const DEFAULT_EFFICIENCY = 100;

module.exports = RoboticFactory;

function RoboticFactory(deps) {

    let efficiency = deps.efficiency || DEFAULT_EFFICIENCY;
    let resourceManager = deps.resourceManager;

    return {
        name: buildingConstants.ROBOTIC_FACTORY,
        canConstruct,
        construct
    };

    function canConstruct() {
        let resources = resourceManager.get();
        return resources.goods + efficiency <= resources.minerals;
    }

    function construct() {
        if (canConstruct()) {
            let resources = resourceManager.get();
            resources.goods += efficiency;
            resourceManager.set('goods', resources.goods);
        }
        else {
            throw new Error('Insufficient mineral production');
        }
    }
}