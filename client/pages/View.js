module.exports = function (deps) {
    let cli = deps.cli;
    let pageRepository = deps.pageRepository;

    return {
        view
    };

    async function view({ currentPageName, pages, commands, loop }) {
        cli.view(`\n///// ${currentPageName} /////`);
        cli.view('Pages:');
        for (const pageName of pages) {
            cli.view('\t - ' + pageName);
        }
        cli.view('Commands:');
        for (const command of Object.keys(commands)) {
            cli.view('\t - ' + command);
        }

        let input = await cli.ask('Choose: ');
        let [command, ...args] = input.split(' ');
        if (commands[command]) {
            await commands[command](args.join(' '));
            await cli.ask('press enter . . .');
            return void loop();
        }

        let pageName = pages.find(p => p === command);
        if (!pageName) {
            setTimeout(loop);
        }
        else {
            let page = pageRepository.getByName(pageName);
            page.run();
        }
    }
};