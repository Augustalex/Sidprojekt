const rl = require('readline');

module.exports = function () {
    let readLineInterface = rl.createInterface(process.stdin, process.stdout, null);

    return {
        ask,
        command,
        view
    };

    function ask(question) {
        return new Promise(resolve => {
            readLineInterface.question(question, resolve);
        });
    }

    async function command(commands) {
        let answer = await ask('> ');
        let [commandName, ...args] = answer.split(' ');
        let choosenCommand = getCommandByName(commandName, commands);
        if (choosenCommand) {
            try {
                await choosenCommand(args.join(' '));
            }
            catch (ex) {
                console.log('Command failed with: ' + ex.message);
            }
        }
        else {
            await command(commands);
        }
        view('');
    }

    function getCommandByName(name, allCommands) {
        let lowerCaseCommands = {};
        Object.keys(allCommands).forEach(key => {
            lowerCaseCommands[key.toLowerCase()] = allCommands[key];
        });

        let lowerCaseCommandName = name.toLowerCase();
        return lowerCaseCommands[lowerCaseCommandName];
    }

    function view(output) {
        console.log(output);
    }
};