Home.name = 'Home';

module.exports = Home;

function Home(deps) {
    let cli = deps.cli;
    let authClient = deps.authClient;
    let solarClient = deps.solarClient;
    let pageRepository = deps.pageRepository;
    let pageHierarchy = deps.pageHierarchy;
    let view = deps.view;

    const commands = {
        async 'register-as'(name) {
            let pass = await authClient.registerUser(name);
            if (pass) {
                deps.player = { name, pass };
                cli.view('REGISTERED SUCCESSFULLY');
            }
        }
    };

    return {
        run
    };

    async function run() {
        view.view({
            currentPageName: Home.name,
            pages: pageHierarchy[Home.name],
            commands,
            loop: run
        });
    }
}