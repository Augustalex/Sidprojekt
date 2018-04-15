const axios = require('axios');

module.exports = {
    async get(url) {
        let response = await axios.get(url);
        return response.data;
    },
    async post(url, data) {
        let response = await axios.post(url, data);
        return response.data;
    },
    async postBlob(url, data) {
        let response = await axios.post(url, data, {
            header: {
                'Content-Type': 'application/octet-stream'
            }
        });
        return response.data;
    }
};