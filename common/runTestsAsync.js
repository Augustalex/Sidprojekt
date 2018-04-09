const bocha = require('bocha');

module.exports = async function (tests) {
    await runTestsAsOne(tests);
};

async function runTestsAlone(tests) {
    for (test of tests) {
        let name = Object.keys(test)[0];
        console.log(name);

        await new Promise(resolve => {
            bocha.runTestCase(test, {}, resolve);
        });
    }
}

async function runTestsAsOne(tests) {
    let allTests = {};
    tests.forEach(test => allTests = { ...allTests, ...test });
    await runTestsAlone([{ 'All': allTests }]);
}