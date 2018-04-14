<template>
    <div class="section">
        <div class="subTrack-row">
            <label>{{ subTrack.title }}</label>
            <button
                    v-if="!activeRecording"
                    :disabled="!activeRecording && cannotRecord"
                    @click="startRecording"
                    class="button--red">
                REC
            </button>
            <button v-else @click="stopRecording">Stop</button>
            <button @click="selectInPlayer(subTrack)">Select</button>
        </div>
        <div v-if="subTracks.length" class="subTracksContainer">
            <sub-track
                    v-for="track in subTracks"
                    :subTrack="track"
                    :cannotRecord="true"
                    @selectInPlayer="selectInPlayer"/>
        </div>
    </div>
</template>
<script>
    import recUtils from '../utils/recUtils.js';

    export default {
        name: 'sub-track',
        props: ['subTrack', 'cannotRecord'],
        data() {
            return {
                subTracks: [],
                activeRecording: null
            };
        },
        methods: {
            selectInPlayer(recording) {
                this.$emit('selectInPlayer', recording);
            },
            async startRecording() {
                this.$emit('recording', true);
                try {
                    this.activeRecording = await recUtils.startRecording();
                }
                catch (err) {
                    alert(err);
                }
            },
            async stopRecording() {
                this.$emit('recording', false);
                let audioSrc = await this.activeRecording.stop();
                this.activeRecording = null;
                let title = prompt('Name recording');
                this.storeRecording(title, audioSrc);
            },
            storeRecording(title, audioSrc) {
                let recording = {
                    title,
                    src: audioSrc,
                    parentTitle: this.subTrack.parentTitle ? this.subTrack.parentTitle + ' > ' + this.subTrack.title : this.subTrack.title
                }
                this.subTracks.push(recording);
                this.$emit('selectInPlayer', recording);
            }
        }
    };
</script>
<style lang="scss">
    @import "../node_modules/mini.css/src/flavors/mini-nord.scss";

    .subTracksContainer {
        margin-left: 5%;
        margin-bottom: 20px;
    }
</style>