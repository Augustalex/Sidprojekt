module.exports = async function (req, res, next) {
    if (req.method === 'POST') {
        req.buffer = await readBuffer(req);
    }
    next();
};

function readBuffer(req) {
    return new Promise(resolve => {
        let dataBuffers = [];
        req
            .on('data', chunk => {
                dataBuffers.push(chunk);
            })
            .on('end', () => {
                let buffer = Buffer.concat(dataBuffers)
                resolve(buffer);
            });
    });
}