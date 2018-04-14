const recUtils = require('../bandHelper/utils/recUtils.js');
const axios = require('axios');

const audioContext = new (window.AudioContext || window.webkitAudioContext)();

module.exports = {
    async get(url) {
        let response = await axios.get(url);
        return response.data;
    },
    async getAudioUrl(url) {
        let source = audioContext.createBufferSource();

        let response = await axios.get(url, {
            responseType: 'arraybuffer'
        });
        console.log(response.headers, response.data)
        await new Promise(resolve => {
            let buffer = new Buffer(response.data, 'binary');
            audioContext.decodeAudioData(response.data, buffer => {
                    source.buffer = buffer;
                    source.connect(audioContext.destination);
                    source.loop = true;
                    resolve();
                },
                e => void console.log("Error with decoding audio data: " + e)
            );
        });
        let src = await recUtils.getBlobUrlFromSource(source);
        return src;
        // let blob = new Blob([buffer], { type: 'audio/wav' });
        // let player = document.querySelector('.audioPlayer audio');
        // player.src = window.URL.createObjectURL(blob);
        // console.log(player.src)
        // player.play();
        // return blob;
    },
    async post(url, data) {
        let response = await axios.post(url, data);
        return response.data;
    },
    async postAudioBlob(url, data) {
        let response = await axios.post(url, data, {
            header: {
                'Content-Type': 'application/octet-stream'
            }
        });
        return response.data;
    }
};