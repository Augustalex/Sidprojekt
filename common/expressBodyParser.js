let parseUrl = require('./parseUrl.js');

module.exports = async function (req, res, next) {
    if (req.method === 'POST') {
        req.body = await loadJsonBody(req);
    }
    else if (req.method === 'GET') {
        const { path, query: queryString } = parseUrl(req.url);
        if (queryString) {
            let query = {};
            let parts = queryString.split('&');
            for (let part of parts) {
                const [key, value] = part.split('=');
                query[key] = value;
            }
            req.query = query;
        }
    }
    next();
};

async function loadJsonBody(req) {
    let rawBody = await readBody(req);
    if (rawBody.length) {
        try {
            let json = JSON.parse(rawBody);
            return json;
        }
        catch (err) {
            return rawBody;
        }
    }
    return '';
}

function readBody(req) {
    return new Promise(resolve => {
        let dataBuffers = [];
        req
            .on('data', chunk => {
                dataBuffers.push(chunk);
            })
            .on('end', () => {
                resolve(Buffer.concat(dataBuffers).toString());
            });
    });
}