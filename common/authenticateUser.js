module.exports = function (controller, { authClient }) {
    return async (req, res) => {
        let player;
        if (req.method === 'GET') {
            if (!req.query) {
                throw new Error('Query not parsed or no credentials were given')
            }
            player = { name: req.query.name, pass: req.query.pass };
        }
        else if (req.method === 'POST') {
            player = req.body.player;
        }

        let valid = await authClient.verifyUser(player.name, player.pass);
        if (!valid) {
            res.writeHead('401');
            res.end();
        }
        else {
            req.player = player;
            controller(req, res);
        }
    };
};