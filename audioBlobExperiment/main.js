import "babel-polyfill";
import audioAjax from './audioAjax.js';

(async function () {
    let player = document.querySelector('#player');

    console.log('getting audio!')
    let audioUrl = await audioAjax.getAudioUrl('/get-sample-audio');
    player.src = audioUrl;
    console.log('GOT AUDIO URL', audioUrl)
}());