import recUtils from '../bandHelper/utils/recUtils.js';
import exportWAV from './exportWAV.js';
import axios from 'axios';

const audioContext = new (window.AudioContext || window.webkitAudioContext)();

export default {
    async get(url) {
        let response = await axios.get(url);
        return response.data;
    },
    async getAudioUrl(url) {
        console.log('get AUDIO url')

        let response = await axios.get(url, {
            responseType: 'arraybuffer'
        });
        // let decodedData = await  audioContext.decodeAudioData(response.data);
        // document.addEventListener('click', () => {
        //     let source = audioContext.createBufferSource(); // creates a sound source
        //     source.buffer = decodedData;                    // tell the source which sound to play
        //     source.connect(audioContext.destination);       // connect the source to the context's destination (the speakers)
        //     // source.start(0);                           // play the source now// note: on older systems, may have to use deprecated noteOn(time);
        // });

        // let source = audioContext.createBufferSource(); // creates a sound source
        // source.buffer = decodedData;
        // let src = await recUtils.getBlobUrlFromSource(source);
        // console.log('src', src)
        // document.getElementById('player');
        // player.src = src;
        console.log(response.data)
        let blob = exportWAV(response.data, audioContext.sampleRate, response.data.length);
        console.log('BLOB', blob)
        // let blob = new Blob([new Uint8Array(decodedData)], { type: 'audio/wav' });
        return window.URL.createObjectURL(blob);
        // await new Promise(resolve => {
        //             console.log(response.data)
        //     audioContext.decodeAudioData(response.data, buffer => {
        //             //     let buffer = new Buffer(response.data, 'binary');
        //             let blob = new Blob([buffer], { type: 'audio/wav' });
        //             console.log(blob)
        //             // source.buffer = buffer;
        //             // source.connect(audioContext.destination);
        //             // source.loop = true;
        //             resolve();
        //         },
        //         e => void console.log("Error with decoding audio data: " + e)
        //     );
        // });
        // let src = await recUtils.getBlobUrlFromSource(source);
        // return src;
        return '';
        //     let buffer = new Buffer(response.data, 'binary');
        // let blob = new Blob([buffer], { type: 'audio/wav' });
        // return window.URL.createObjectURL(blob);
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