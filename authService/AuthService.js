module.exports = function (deps) {

    let http = deps.http;
    let directoryClient = deps.directoryClient;
    let ipUtils = deps.ipUtils;
    let logger = deps.logger;
    let userController = deps.userController;

    return {
        start
    };

    async function start() {
        let server = http.createServer(router);
        const port = await ipUtils.getPort();
        server.listen(port);

        let ipAddress = ipUtils.address();
        await directoryClient.register('AuthService', ipAddress, port);
        logger.info('AuthService:' + port + ' [REGISTERED]');

        return `http://${ipAddress}:${port}`;
    }

    async function router(req, res) {
        if (req.method === 'GET') {
            userController.verifyUser(req, res);
        }
        else if (req.method === 'POST') {
            userController.registerUser(req, res);
        }
    }
};