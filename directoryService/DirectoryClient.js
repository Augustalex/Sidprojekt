const axios = require('axios');

module.exports = function (deps) {

    let directoryUrl = deps.directoryUrl;

    return {
        ping,
        register,
        getAll,
        search
    };

    async function ping() {
        try {
            let response = await axios.get(`${directoryUrl}/ping`);
            return response.data === 'pong';
        }
        catch (err) {
            return false;
        }
    }

    async function register(name, ip, port) {
        let encodedName = encodeURIComponent(name);
        await axios.post(`${directoryUrl}/${encodedName}/${ip}/${port}`);
    }

    async function getAll() {
        let response = await axios.get(`${directoryUrl}/`);
        return response.data;
    }

    async function search({ type }) {
        let serviceTypesByUrl = await getAll();
        let serviceUrls = Object.keys(serviceTypesByUrl);
        return serviceUrls.filter(url => serviceTypesByUrl[url].startsWith(type));
    }
};