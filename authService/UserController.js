module.exports = UserController;

function UserController(deps) {

    let uuid = deps.uuid;

    let users = {
        test: 'ABC'
    };

    return {
        registerUser,
        verifyUser
    };

    function verifyUser(req, res) {
        let [name, pass] = req.url.split('/').filter(s => s !== '');
        res.writeHead(200, { 'Content-Type': 'text/plain' });

        if (users[name] && users[name] === pass) {
            res.end('pass');
        }
        else {
            res.end('fail');
        }
    }

    function registerUser(req, res) {
        let { name } = req.body;
        if (users[name]) {
            res.writeHead(403);
            res.end();
        }
        else {
            let pass = uuid();
            users[name] = pass;
            res.writeHead(200, { 'Content-Type': 'text/plain' }); //Very safe
            res.end(pass);
        }
    }
}