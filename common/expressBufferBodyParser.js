module.exports = async function (req, res, next) {
    if (req.method === 'POST') {
        req.body = await readBody(req);
    }
    next();
};

function readBody(req) {
    return new Promise(resolve => {
        let dataBuffers = [];
        req
            .on('data', chunk => {
                dataBuffers.push(chunk);
            })
            .on('end', () => {
                resolve(Buffer.concat(dataBuffers).toString('binary'));
            });
    });
}