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
                <button v-if="!isRecording" @click="startRecording">Start recording</button>
                <button v-else @click="stopRecording">Stop recording</button>
            </div>
        </div>
        <div class="section">
            <h2>Recordings</h2>
            <div class="column">
                <div v-for="recording in recordings" class="card fluid">
                    <label>{{ recording.title }}</label>
                    <button v-if="!activeSubTrackRecording" @click="startSubTrackRecording(recording)">
                        Record sub track
                    </button>
                    <button v-else @click="stopSubTrackRecording(recording)">Stop recording</button>
                    <button @click="recordingClick(recording)">Select in player</button>
                    <div v-for="subTrack in (recording.subTracks || [])" class="subTrack-row">
                        <label>{{ subTrack.title }}</label>
                        <button @click="recordingClick(subTrack)">Select in player</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import "babel-polyfill";
    import getUserMedia from '../utils/getUserMedia.js';
    import Recorder from '../utils/recorder.js';
    import recUtils from '../utils/recUtils.js';

    export default {
        data () {
            return {
                playerRecording: null,
                recordings: [],
                activeRecording: null,
                activeSubTrackRecording: null
            }
        },
        computed: {
            isRecording() {
                return !!this.activeRecording;
            },
            playerRecordingTitle() {
                if (this.playerRecording) {
                    let title = this.playerRecording.title;
                    if (this.playerRecording.parentTitle) {
                        return title + `<small> [${this.playerRecording.parentTitle}]</small>`;
                    }
                    return title;
                }
                return '';
            }
        },
        methods: {
            async startRecording() {
                this.activeRecording = await recUtils.startRecording();
            },
            async stopRecording() {
                if (this.activeRecording) {
                    this.stopMainRecording();
                }
                else {
                    this.stopSubTrackRecording();
                }
            },
            async stopMainRecording() {
                let audioSrc = await this.activeRecording.stop();
                this.activeRecording = null;
                let title = prompt('Name recording');
                this.storeMainRecording(title, audioSrc);
            },
            async startSubTrackRecording(recording) {
                console.log('startSubTrackRecording');
                let activeRecording = await recUtils.startRecording();
                this.activeSubTrackRecording = {
                    recording: activeRecording,
                    parentRecording: recording
                };
            },
            async stopSubTrackRecording() {
                let audioSrc = await this.activeSubTrackRecording.recording.stop();
                let title = prompt('Name recording');
                this.storeSubTrackRecording(title, audioSrc, this.activeSubTrackRecording.parentRecording);
                this.activeSubTrackRecording = null;
            },
            storeSubTrackRecording(title, audioSrc, parentRecording) {
                let recording = {
                    title,
                    parentTitle: parentRecording.title,
                    src: audioSrc
                };
                parentRecording.subTracks = parentRecording.subTracks || [];
                parentRecording.subTracks.push(recording);
                this.playerRecording = recording;
            },
            storeMainRecording(title, audioSrc) {
                let recording = {
                    title,
                    src: audioSrc
                };
                this.recordings.push(recording);
                this.playerRecording = recording;
            },
            recordingClick(recording) {
                this.playerRecording = recording;
            }
        }
    }
</script>
<style lang="scss" scoped>
    @import "../node_modules/mini.css/src/flavors/mini-nord.scss";

    .subTrack-row {
        display: flex;
        width: 100%;
        align-items: center;
        justify-content: flex-start;
        margin-left: 1%;
    }

    small {
        font-size: .2em;
    }
</style>