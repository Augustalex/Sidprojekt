module.exports = function (deps) {
    let cli = deps.cli;
    let authClient = deps.authClient;
    let solarClient = deps.solarClient;
    let pageRepository = deps.pageRepository;
    let pageHierarchy = deps.pageHierarchy;

    return {
        run
    };

    function run() {
        let page = pageRepository.getByName('Home');
        page.run();
    }
};