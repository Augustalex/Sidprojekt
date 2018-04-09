const axios = require('axios');

module.exports = function ({ authServiceUrl }) {

    return {
        async registerUser(name) {
            try {
                let response = await axios.post(`${authServiceUrl}`, { name });
                return response.data;
            }
            catch (err) {
                if (err.response.status === 403) throw new Error('Name already taken');
                throw err;
            }
        },
        async verifyUser(userName, pass) {
            let encodedName = encodeURIComponent(userName);
            let response = await axios.get(`${authServiceUrl}/${encodedName}/${pass}`);
            return response.data === 'pass';
        }
    };
};