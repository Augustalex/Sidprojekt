const axios = require('axios');

module.exports = function (deps) {

    let solarServiceUrl = deps.solarServiceUrl;

    return {
        async getPlanets() {
            let player = getPlayer();
            let response = await axios.get(`${solarServiceUrl}/planets?name=${player.name}&pass=${player.pass}`);
            return response.data;
        },
        async settlePlanet(planetName) {
            let player = getPlayer();
            try {
                let response = await axios.post(`${solarServiceUrl}/settle-planet`, {
                    player,
                    planetName
                });
                return response.data;
            }
            catch (error) {
                if (error.response.status = 403) throw new Error(error.response.data);
                throw error;
            }
        },
        async getAllConstructionOptionsOnPlanet(planetName) {
            let player = getPlayer();
            let response = await axios.get(`${solarServiceUrl}/planet/${planetName}/construction-options?name=${player.name}&pass=${player.pass}`);
            return response.data;
        },
        async constructBuildingOnPlanet(buildingName, planetName) {
            let player = getPlayer();
            try {
                let response = await axios.post(`${solarServiceUrl}/planet/${planetName}/construct-building`, {
                    player,
                    buildingName
                });
                return response.data;
            }
            catch (error) {
                if (error.response.status = 403) throw new Error(error.response.data);
                throw error;
            }
        }
    };

    function getPlayer() { // TODO Have separate class where the registered user is put instead of putting it in deps
        return deps.player;
    }
};