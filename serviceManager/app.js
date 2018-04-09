let Directory = require('../directoryService/Directory.js');
let Auth = require('../authService/Constructor.js');
let AuthClient = require('../authService/AuthClient.js');
let Solar = require('../solarService/Constructor.js');
let SolarClient = require('../solarService/SolarClient.js');
let DirectoryClient = require('../directoryService/DirectoryClient.js');
let CLI = require('../common/CLI.js');
let pageHierarchy = require('../client/pages/pageHierarchy.js');
let PageRepository = require('../client/pages/PageRepository.js');
let Client = require('../client/Client.js');
const View = require('../client/pages/View.js');
let ServiceFactory = require('./ServiceFactory.js');

(async function () {
    let directoryUrl = Directory().start();
    let directoryClient = DirectoryClient({ directoryUrl });

    let serviceFactory = ServiceFactory({ directoryClient });
    let cli = CLI();

    const availableServices = [
        {
            name: 'Auth service',
            start: () => serviceFactory.createAuthService().start()
        },
        {
            name: 'Solar service',
            start: () => serviceFactory.createSolarService().start()
        }
    ];

    const rootCommands = {
        async 'running-services'() {
            cli.view('\nRunning services:');
            let serviceNameByUrl = await directoryClient.getAll();
            let view = Object.keys(serviceNameByUrl)
                .map(url => `${serviceNameByUrl[url]} [${url}]`)
                .join('\n');
            cli.view(view);
        },
        async 'start-service'() {
            cli.view('\n///// Available services /////');
            cli.view(availableServices.map(s => `- ${s.name}`).join('\n'));

            let choice = await cli.ask('Start service: ');
            let service = availableServices.find(s => s.name === choice);
            if (service) {
                let url = await service.start();
                if (url) {
                    cli.view(` -- Started ${choice} at ${url} -- `);
                }
                else {
                    cli.view(` -- Failed to start ${choice} -- `);
                }
            }
            else {
                cli.view('Could not find a service by that name, try again.');
                await new Promise(resolve => {
                    setTimeout(resolve, 1500);
                });
                rootCommands['start-service']();
            }
        }
    };

    const loop = async () => {
        cli.view('///// Commands /////');
        cli.view(Object.keys(rootCommands).map(key => `- ${key}`).join('\n'));
        await cli.command(rootCommands);
        // let command = await cli.ask('> ');
        // await rootCommands[command]();
        setTimeout(loop);
    };
    loop();
}());