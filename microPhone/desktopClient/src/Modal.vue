<template>
    <div class="modal-wrapper" ref="modalWrapper" tabindex="0" @keydown.esc="$emit('close')">
        <div class="modal-overlay" @click.self="$emit('close')"></div>
        <div class="modal">
            <h1>{{ title }}</h1>
            <div class="modal-content">
                <slot></slot>
            </div>
        </div>
    </div>
</template>
<script>
    module.exports = {
        props: ['title'],
        mounted() {
            this.$refs.modalWrapper.focus();
        }
    };
</script>
<style lang="scss" scoped>
    .modal-overlay {
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background: rgba(0, 0, 0, 0.4);
    }

    .modal {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        min-width: 250px;
        min-height: 90px;
        background: white;
        box-shadow: 0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23);

        h1 {
            margin: 5px;
            font-size: 1.2em;
            text-align: left;
            font-family: Helvetica, serif;
            font-weight: bold;
        }

        p {
            font-size: 1.2em;
            text-align: center;
            font-family: Helvetica, serif;
            font-weight: lighter;
        }
    }

    .modal-content {
        margin: 0 5% 5% 5%;
    }
</style>