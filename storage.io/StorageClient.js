const axios = require('axios');

const storageServiceUrl = 'http://localhost:2999';

module.exports = function () {

    return {
        get,
        store
    };

    async function get(id) {
        let encodedId = encodeURIComponent(id);
        let response = await axios.get(`${storageServiceUrl}/${encodedId}`)
        return response.data;
    }

    async function store(data) {
        let response = await axios.post(`${storageServiceUrl}`, data);
        return response.data;
    }
};