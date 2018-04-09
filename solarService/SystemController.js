module.exports = function SystemController(deps) {

    let planetRepository = deps.planetRepository;

    return {
        getPlanets,
        settlePlanet
    };

    function getPlanets(req, res) {
        let planetInfos = planetRepository.getPlanets().map(p => p.getInfo());
        res.json(planetInfos);
    }

    async function settlePlanet(req, res) {
        let { player, planetName } = req.body;
        let planets = planetRepository.getPlanets();
        let planet = planets.find(p => p.name === planetName);
        if (!planet.getOwner()) {
            planet.setOwner(player.name);
            res.end();
        }
        else {
            res.writeHead(403);
            res.end('Already settled');
        }
    }
};