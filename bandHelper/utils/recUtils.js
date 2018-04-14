import "babel-polyfill";
import getUserMedia from '../utils/getUserMedia.js';
import Recorder from '../utils/recorder.js';

navigator.getUserMedia = ( navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia ||
    navigator.msGetUserMedia);
const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioContext = new AudioContext;
export default {
    async startRecording() {
        let audioStream = await getUserMedia({ audio: true });
        let input = audioContext.createMediaStreamSource(audioStream);
        let recorder = new Recorder(input);
        recorder.record();

        return {
            stop() {
                return new Promise(resolve => {
                    recorder.stop();
                    audioStream.getAudioTracks()[0].stop();

                    recorder.exportWAV(blob => {
                        recorder.clear();
                        let srcUrl = window.URL.createObjectURL(blob);
                        resolve(srcUrl);
                    }, "audio/wav");
                });
            }
        };
    },
    async getBlobUrlFromSource(source) {
        // let input = audioContext.createMediaStreamSource(source);
        let recorder = new Recorder(source);
        let src = await new Promise(resolve => {
            recorder.exportWAV(blob => {
                recorder.clear();
                let srcUrl = window.URL.createObjectURL(blob);
                resolve(srcUrl);
            }, "audio/wav");
        });
        return src;
    },
    async startRawRecording() {
        let audioStream = await getUserMedia({ audio: true });
        let input = audioContext.createMediaStreamSource(audioStream);
        let recorder = new Recorder(input);
        recorder.record();

        return {
            stop() {
                return new Promise(resolve => {
                    recorder.stop();
                    audioStream.getAudioTracks()[0].stop();

                    recorder.exportWAV(blob => {
                        recorder.clear();
                        resolve(blob);
                    }, "audio/wav");
                });
            }
        };
    }
};