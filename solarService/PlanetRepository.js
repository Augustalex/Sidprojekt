const planetFactory = require('./planet/planetFactory.js');

const MAX_PLANET_COUNT = 10;
module.exports = function () {

    let planets = [];

    const planetCount = Math.round(MAX_PLANET_COUNT * Math.random()) + 1;
    for (let i = 0; i < planetCount; i++) {
        planets.push(planetFactory.create());
    }

    return {
        getPlanets() {
            return planets.map(p => ({ ...p }));
        },
        getByName(name) {
            return planets.find(p => p.name === name);
        }
    }
};