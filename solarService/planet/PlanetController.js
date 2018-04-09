module.exports = function PlanetController(deps) {

    let planetName = deps.planetName;
    let planetRepository = deps.planetRepository;

    return {
        getAllConstructionOptions: mustBeOwner(getAllConstructionOptions),
        constructBuilding: mustBeOwner(constructBuilding)
    };

    function getAllConstructionOptions(req, res) {
        let planet = planetRepository.getByName(planetName);
        res.json(planet.getAllConstructionOptions());
    }

    function constructBuilding(req, res) {
        let planet = planetRepository.getByName(planetName);
        planet.constructBuilding(req.body.buildingName);
        res.end();
    }

    function mustBeOwner(fn) {
        return (req, res) => {
            let planet = planetRepository.getByName(planetName);
            if (planet.getOwner() !== req.player.name) {
                res.writeHeader(403);
                res.end();
            }
            else {
                fn(req, res);
            }
        };
    }
};