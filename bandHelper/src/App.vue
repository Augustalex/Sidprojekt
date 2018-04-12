<template>
    <div class="container">
        <div class="row">
            <div class="card">
                <h2 v-if="playerRecordingTitle" v-html="playerRecordingTitle"></h2>
                <h2 v-else>Audio player</h2>
                <audio :src="playerRecording && playerRecording.src" controls loop class="section"></audio>
            </div>
            <div class="card">
                <h2>Recorder</h2>
                <button v-if="!activeRecording" :disabled="!activeRecording && isRecording" @click="startRecording">Start recording</button>
                <button v-else @click="stopRecording">Stop recording</button>
            </div>
        </div>
        <div class="section">
            <h2>Recordings</h2>
            <div class="column">
                <main-track
                        v-for="recording in recordings"
                        :track="recording"
                        :cannotRecord="isRecording"
                        @selectInPlayer="recordingClick"
                        @recording="setIsRecording"/>
            </div>
        </div>
    </div>
</template>
<script>
    import "babel-polyfill";
    import getUserMedia from '../utils/getUserMedia.js';
    import Recorder from '../utils/recorder.js';
    import recUtils from '../utils/recUtils.js';
    import SubTrackView from './SubTrack.vue';
    import TrackView from './Track.vue';

    export default {
        data() {
            return {
                playerRecording: null,
                recordings: [],
                activeRecording: null,
                activeSubTrackRecording: null,
                isRecording: false
            }
        },
        computed: {
            playerRecordingTitle() {
                if (this.playerRecording) {
                    let title = this.playerRecording.title;
                    if (this.playerRecording.parentTitle) {
                        return title + `<small class="parentTitle"> [${this.playerRecording.parentTitle}]</small>`;
                    }
                    return title;
                }
                return '';
            }
        },
        methods: {
            setIsRecording(isRecording) {
                this.isRecording = isRecording;
            },
            async startRecording() {
                try {
                    this.activeRecording = await recUtils.startRecording();
                }
                catch (err) {
                    alert(err);
                }
            },
            async stopRecording() {
                let audioSrc = await this.activeRecording.stop();
                this.activeRecording = null;
                let title = prompt('Name recording');
                this.storeRecording(title, audioSrc);
            },
            storeRecording(title, audioSrc) {
                let recording = {
                    title,
                    src: audioSrc,
                    subTracks: []
                };
                this.recordings.push(recording);
                this.playerRecording = recording;
            },
            recordingClick(recording) {
                this.playerRecording = recording;
            }
        },
        components: {
            'sub-track': SubTrackView,
            'main-track': TrackView
        }
    }
</script>
<style lang="scss">
    @import "../node_modules/mini.css/src/flavors/mini-nord.scss";

    .subTrack-row {
        display: flex;
        width: 100%;
        align-items: center;
        justify-content: flex-start;
        margin-left: 1%;
    }

    .parentTitle {
        display: inline;
    }
</style>