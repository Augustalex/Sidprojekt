import "babel-polyfill";
import getUserMedia from '../utils/getUserMedia.js';
import Recorder from '../utils/recorder.js';

module.exports = {
    async startRecording() {
        let audio_context = new AudioContext;
        let audioStream = await getUserMedia({ audio: true });
        let input = audio_context.createMediaStreamSource(audioStream);
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
    }
};