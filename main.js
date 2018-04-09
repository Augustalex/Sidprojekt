let Directory = require('./directoryService/Directory.js');
let Auth = require('./authService/Constructor.js');
let AuthClient = require('./authService/AuthClient.js');
let DynamicAuthClient = require('./authService/DynamicAuthClient.js');
let Solar = require('./solarService/Constructor.js');
let SolarClient = require('./solarService/SolarClient.js');
let DirectoryClient = require('./directoryService/DirectoryClient.js');
let CLI = require('./common/CLI.js');
let pageHierarchy = require('./client/pages/pageHierarchy.js');
let PageRepository = require('./client/pages/PageRepository.js');
let Client = require('./client/Client.js');
const View = require('./client/pages/View.js');
let { directoryServicePort } = require('./settings.json');

(async function () {
    let directoryUrl = `http://localhost:${directoryServicePort}`;
    let directoryClient = DirectoryClient({ directoryUrl });

    let connectedToDirectory = false;
    while (!connectedToDirectory) {
        connectedToDirectory = await directoryClient.ping();
        if (!connectedToDirectory) {
            console.error('Could not reach the Directory service, will try again in 2s');
            await wait(2000);
        }
    }

    let solarServiceUrl = await searchDirectoryForServiceWithRetry(directoryClient, 'SolarService');
    let solarClient = SolarClient({ solarServiceUrl });

    // let authServiceUrl = await searchDirectoryForServiceWithRetry(directoryClient, 'AuthService');
    // let authClient = AuthClient({ authServiceUrl });
    let authClient = DynamicAuthClient({ directoryClient });

    let cli = CLI();
    let deps = {
        cli,
        directoryClient,
        authClient,
        solarClient,
        pageHierarchy
    };
    let pageRepository = PageRepository(deps);
    deps.pageRepository = pageRepository;
    deps.view = View(deps);
    pageRepository.init();

    let client = Client(deps);

    const loop = () => {
        try {
            client.run();
        }
        catch (err) {
            console.error(err);
            loop();
        }
    };
    loop();
}());

async function searchDirectoryForServiceWithRetry(directoryClient, serviceType) {
    let url;
    while (!url) {
        [url] = await directoryClient.search({ type: serviceType });
        if (!url) {
            console.error('Could not find a running ' + serviceType + ', will search again in 2s');
        }
        await wait(2000);
    }
    return url;
}

function wait(milliseconds) {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
}