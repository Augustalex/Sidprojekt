<template>
    <div class="card fluid">
        <label>{{ track.title }}</label>
        <!--<button v-if="!activeRecording && cannotRecord" disabled>Cannot record</button>-->
        <button v-if="!activeRecording" :disabled="!activeRecording && cannotRecord" @click="startRecording">Record sub track</button>
        <button v-else @click="stopRecording">Stop recording</button>
        <button @click="selectInPlayer(track)">Select in player</button>
        <sub-track
                v-for="subTrack in subTracks"
                :subTrack="subTrack"
                :cannotRecord="cannotRecord"
                @selectInPlayer="selectInPlayer"
                @recording="setIsRecording"
        />
    </div>
</template>
<script>
    import recUtils from '../utils/recUtils.js';
    import SubTrackView from './SubTrack.vue';

    export default {
        props: ['track', 'cannotRecord'],
        data() {
            return {
                subTracks: [],
                activeRecording: null
            };
        },
        methods: {
            setIsRecording(isRecording) {
                this.$emit('recording', isRecording);
            },
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
                    parentTitle: this.track.title
                }
                this.subTracks.push(recording);
                this.$emit('selectInPlayer', recording);
            }
        },
        components: {
            'sub-track': SubTrackView
        }
    };
</script>