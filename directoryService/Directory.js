let http = require('http');
let ipUtils = require('../common/ipUtils.js');

let settings = require('../settings.json');
const PORT = settings.directoryServicePort;

module.exports = function () {

    let serviceNamesByUrl = {};

    return {
        start
    };

    function start() {
        // let url = `http://${ipUtils.address()}:${PORT}`;
        let url = `http://localhost:${PORT}`;
        serviceNamesByUrl[url] = 'DirectoryService';

        let server = http.createServer((req, res) => {
            let url = req.url;
            if (req.url === '/ping') {
                res.end('pong');
            }
            else if (req.method === 'GET') {
                res.writeHead(200, { 'Content-Type': 'application/javascript' });
                res.end(JSON.stringify(serviceNamesByUrl));
            }
            else if (req.method === 'POST') {
                let [name, ip, port] = url.split('/').filter(s => s !== '');
                let serviceUrl = `http://${ip}:${port}`;
                serviceNamesByUrl[serviceUrl] = name;
                res.writeHead(200, { 'Content-Type': 'application/javascript' });
                res.end(JSON.stringify(serviceNamesByUrl));
            }
        });
        server.listen(PORT);
        return url;
    }
};