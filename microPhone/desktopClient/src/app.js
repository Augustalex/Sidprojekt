const Vue = require('vue').default;
const initSocketIO = require('../../utils/initSocketIO.js');
const AppView = require('./App.vue');
const ajax = require('../../../common/ajax.js');

(async function () {
    await initSocketIO();
    const socket = io();

    const vm = new Vue({
        data: {
            audioUrl: '',
            audioList: []
        },
        render(h) {
            return h(AppView, {
                props: {
                    audioUrl: this.audioUrl,
                    audioList: this.audioList
                },
                on: {
                    startRecording: this.startRecording,
                    stopRecording: this.stopRecording,
                    refreshAudioList: this.refreshAudioList,
                    selectAudioInList: this.selectAudioInList
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
            },
            async refreshAudioList() {
                this.audioList = await ajax.get('/audio');
            },
            selectAudioInList(index) {
                let { id } = this.audioList[index];
                this.audioUrl = `audio/${id}`;
            }
        },
        async mounted() {
            socket.on('audioStored', audioUrl => {
                this.audioUrl = audioUrl;
            });
            await this.refreshAudioList();
        }
    });
    vm.$mount('#app');
}());