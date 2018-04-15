const recUtils = require('../../../common/recording/recUtils.js');
const initSocketIO = require('../../utils/initSocketIO.js');
const ajax = require('../../../common/ajax.js');

(async function () {
    await initSocketIO();
    const socket = io();
    let recordInstance;
    socket.on('command', async command => {
        switch (command.name) {
            case 'startRecording':
                if (recordInstance) {
                    await recordInstance.stop();
                }
                recordInstance = await recUtils.startRawRecording();
                break;
            case 'stopRecording':
                const audioBlob = await new Promise(async resolve => {
                    const audioBlob = await recordInstance.stop();
                    resolve(audioBlob);
                });
                const player = document.getElementById('player');
                player.src = window.URL.createObjectURL(audioBlob);
                const recordingName = command.data
                await ajax.postBlob(`/audio/${recordingName}`, audioBlob);
                break;
        }
    });
}());