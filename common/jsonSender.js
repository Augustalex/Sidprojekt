module.exports = function (controller) {
    return (req, res) => {
        res.json = (json) => {
            res.writeHead(200, {
                'content-type': 'application/json'
            });
            res.end(JSON.stringify(json));
        };
        controller(req, res);
    };
};