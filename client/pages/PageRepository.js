const pages = [
    require('./Planets.js'),
    require('./Home.js'),
];

module.exports = function (deps) {

    let pageInstances = {};
    return {
        getByName,
        init
    };

    function getByName(name) {
        return pageInstances[name];
    }

    function init() {
        for (let Page of pages) {
            pageInstances[Page.name] = Page(deps);
        }
    }
};