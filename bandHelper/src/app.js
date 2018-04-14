import Vue from 'vue';
import App from './App.vue';
import ajax from '../../common/ajax.js';

new Vue({
    el: '#app',
    data: {
        recordDirectoryId: null,
        recordings: []
    },
    render(h) {
        return h(App, {
            props: {
                recordings: this.recordings,
                storeRecording: async (...args) => {
                    await this.storeRecording(...args);
                }
            },
            on: {
                storeRecording: this.storeRecording,
                getAllRecordings: this.getAllRecordings
            }
        });
    },
    watch: {
        async recordDirectoryId() {
            console.log('getting all recordings')
            await this.getAllRecordings();
        }
    },
    methods: {
        async storeRecording(title, blob) {
            if (this.recordDirectoryId === null) {
                let blobId = await ajax.postAudioBlob('/data', await blobToBuffer(blob));
                let data = [{ title, blobId }];
                let id = await ajax.post('/data', JSON.stringify(data));
                this.recordDirectoryId = id;
            }
            else {
                let blobId = await ajax.postAudioBlob('/data', Buffer.from(new Uint8Array(blob)));
                let recordDirectory = await ajax.get('/data/' + this.recordDirectoryId);
                recordDirectory.push({ title, blobId });
                let id = await ajax.post('/data', JSON.stringify(recordDirectory));
                this.recordDirectoryId = id;
            }
        },
        async getAllRecordings() {
            let recordDirectory = await ajax.get('/data/' + this.recordDirectoryId);
            let recordings = [];
            for (let entry of recordDirectory) {
                console.log('get blob', '/data/' + entry.blobId)
                let blobUrl = await ajax.getAudioUrl('/data/' + entry.blobId);
                console.log('blobUrl', blobUrl)
                recordings.push({
                    title: entry.title,
                    src: blobUrl
                });
            }
            console.log('got all recordings: ', recordings)
            this.recordings = recordings;
        }
    }
});

function blobToBuffer(blob) {
    return new Promise(resolve => {
        let arrayBuffer;
        let fileReader = new FileReader();
        fileReader.onload = function () {
            arrayBuffer = this.result;
            resolve(arrayBuffer);
        };
        fileReader.readAsArrayBuffer(blob);
    });
}