let constructionHierarchy = require('../building/constructionHierarchy.js');

module.exports = function (deps) {

    let name = deps.name;
    let resourceManager = deps.resourceManager;

    let allBuildings = Object.values(constructionHierarchy).map(b => b.file(deps));

    let owner = '';

    return {
        name,
        getAllConstructionOptions,
        constructBuilding,
        getResources,
        setOwner,
        getOwner,
        getInfo
    };

    function getAllConstructionOptions() {
        return allBuildings
            .filter(b => b.canConstruct())
            .map(b => b.name);
    }

    function constructBuilding(buildingName) {
        let building = allBuildings.find(b => b.name === buildingName);
        if (building && building.canConstruct()) {
            building.construct();
        }
        else {
            throw new Error('Cannot construct building');
        }
    }

    function getResources() {
        return resourceManager.get();
    }

    function setOwner(newOwner) {
        owner = newOwner;
    }

    function getOwner() {
        return owner;
    }

    function getInfo() {
        return {
            name,
            owner,
            resources: resourceManager.get()
        };
    }
};