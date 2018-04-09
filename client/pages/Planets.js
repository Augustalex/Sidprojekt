Planets.name = 'Planets';

module.exports = Planets;

function Planets(deps) {
    let cli = deps.cli;
    let authClient = deps.authClient;
    let solarClient = deps.solarClient;
    let pageRepository = deps.pageRepository;
    let pageHierarchy = deps.pageHierarchy;
    let view = deps.view;

    let currentPlanet = '';

    const commands = {
        async 'list-planets'() {
            let planets = await solarClient.getPlanets();
            cli.view(planets.map(p => p.name));
        },
        async 'settle-planet'() {
            await this['list-planets']();
            let planetName = await cli.ask('Planet name: ');
            await solarClient.settlePlanet(planetName, deps.player.name, deps.player.pass);
            cli.view('Settled planet: ' + planetName);
        },
        async 'visit-planet'() {
            await this['list-planets']();
            let planetName = await cli.ask('Planet name: ');
            let planets = await solarClient.getPlanets();
            currentPlanet = planets.find(p => p.name === planetName);
        }
    };

    return {
        run() {
            currentPlanet = null;
            loop();
        }
    };

    async function loop() {
        if (currentPlanet) {
            view.view({
                currentPageName: currentPlanet.name,
                pages: [Planets.name],
                commands: {
                    async 'construct'(buildingName) {
                        await solarClient.constructBuildingOnPlanet(buildingName, currentPlanet.name);
                        cli.view(`Successfully constructed "${buildingName}"`);
                    },
                    async 'build-options'() {
                        let options = await solarClient.getAllConstructionOptionsOnPlanet(currentPlanet.name);
                        cli.view(options);
                    },
                    async 'report'() {
                        let planets = await solarClient.getPlanets();
                        currentPlanet = planets.find(p => p.name === currentPlanet.name);
                        cli.view(currentPlanet);
                    }
                },
                loop
            });
        }
        else {
            view.view({
                currentPageName: Planets.name,
                pages: pageHierarchy[Planets.name],
                commands,
                loop
            });
        }
    }
}