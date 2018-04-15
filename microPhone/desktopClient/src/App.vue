<template>
    <div>
        <audio :src="audioUrl" controls></audio>
        <button v-if="!recording" @click="startClick">Start</button>
        <button v-else @click="stopClick">Stop</button>
        <div>
            <h1>Audio list</h1>
            <button @click="$emit('refreshAudioList')">Refresh audio list</button>
            <div v-for="(entry, index) in audioList" :key="entry.id">
                <label>{{ entry.metadata.name }}</label>
                <button @click="$emit('selectAudioInList', index)">Select in player</button>
            </div>
        </div>
        <modal v-if="recordingNameModalVisible" @close="closeModal">
            <div>
                <label class="label">
                    <span>Enter name for recording</span>
                    <input v-model="recordingName" type="text" maxlength="40"/>
                </label>
                <div class="buttonWrapper">
                    <div v-if="hasMustEnterRecordingNameError" class="errorText">{{ recordingNameModalErrorText }}</div>
                    <button @click="submitRecordingName">Submit</button>
                </div>
            </div>
        </modal>
    </div>
</template>
<script>
    const ModalView = require('./Modal.vue');

    module.exports = {
        props: ['audioUrl', 'audioList'],
        data() {
            return {
                recording: false,
                recordingName: '',
                recordingNameModalErrorText: '',
                recordingNameModalVisible: false
            };
        },
        computed: {
            hasMustEnterRecordingNameError() {
                return this.recordingNameModalErrorText && !this.recordingName;
            }
        },
        methods: {
            startClick() {
                this.recordingNameModalVisible = true;
            },
            submitRecordingName() {
                if (!this.recordingName) {
                    this.recordingNameModalErrorText = 'Please enter a name';
                }
                else {
                    this.recordingNameModalVisible = false;
                    this.recordingNameModalErrorText = '';
                    this.recording = true;
                    this.$emit('startRecording', this.recordingName);
                }
            },
            stopClick() {
                let name = this.recordingName;
                this.recordingName = '';
                this.recording = false;
                this.$emit('stopRecording', name);
            },
            closeModal() {
                this.recordingNameModalVisible = false;
            }
        },
        components: {
            'modal': ModalView
        }
    };
</script>
<style lang="scss" scoped>
    .label {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        margin: 2px;

        span {
            flex: 1 0;
        }

        input {
            padding: 2px;
            border: 1px solid rgba(0, 0, 0, 0.1);
        }
    }

    .errorText {
        color: white;
        background-color: lightcoral;
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 0 5px;
        box-sizing: border-box;
        width: 100%;
        text-align: center;
        border-radius: 2px;
        user-select: none;
    }

    .buttonWrapper {
        margin-top: 20px;
        height: 2em;
        display: flex;
        justify-content: flex-end;
        width: 100%;
    }

    button {
        cursor: pointer;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 15px;
        /*padding: 10px 28px;*/
        color: #fff;
        background-color: #26a69a;
        letter-spacing: .5px;
        border: none;
        text-transform: uppercase;
        border-radius: 2px;
        box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 3px 1px -2px rgba(0, 0, 0, 0.12), 0 1px 5px 0 rgba(0, 0, 0, 0.2);
        user-select: none;
    }
</style>