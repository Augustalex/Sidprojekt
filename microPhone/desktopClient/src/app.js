const Vue = require('vue').default;
const initSocketIO = require('../../utils/initSocketIO.js');
const AppView = require('./App.vue');

(async function () {
    await initSocketIO();
    const socket = io();

    const vm = new Vue({
        data: {
            audioUrl: ''
        },
        render(h) {
            return h(AppView, {
                props: {
                    audioUrl: this.audioUrl
                },
                on: {
                    startRecording: this.startRecording,
                    stopRecording: this.stopRecording
                }
            });
        },
        methods: {
            startRecording() {
                socket.emit('command', { name: 'startRecording' });
            },
            stopRecording(recordingName) {
                socket.emit('command', {
                    name: 'stopRecording',
                    data: recordingName
                });
            }
        },
        mounted() {
            socket.on('audioUrl', url => {
                this.audioUrl = url;
            });
        }
    });
    vm.$mount('#app');
}());