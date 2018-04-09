module.exports = function (deps) {

    let http = deps.http;
    let directoryClient = deps.directoryClient;
    let ipUtils = deps.ipUtils;
    let logger = deps.logger;
    let systemController = deps.systemController;
    let planetRouter = deps.planetRouter;

    return {
        start
    };

    async function start() {
        let server = http.createServer(router);
        const port = await ipUtils.getPort();
        server.listen(port);

        let ipAddress = ipUtils.address();
        await directoryClient.register('SolarService', ipAddress, port);
        logger.info('SolarService:' + port + ' [REGISTERED]');

        return `http://${ipAddress}:${port}`;
    }

    function router(req, res) {
        let url = req.url;
        if (url.startsWith('/planets')) {
            systemController.getPlanets(req, res);
        }
        else if (url.startsWith('/settle-planet')) {
            systemController.settlePlanet(req, res);
        }
        else if (url.startsWith('/planet/')) {
            planetRouter.handle(req, res);
        }
    }
};