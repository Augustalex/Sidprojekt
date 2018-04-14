function exportWAV(sourceBuffer, sampleRate = 41000, bufferLength = 4096) {
    console.log(sourceBuffer)
    // let buffer = mergeBuffers(sourceBuffer, bufferLength);
    let dataview = encodeWAV(sourceBuffer, sampleRate);
    return new Blob([dataview], { type: 'audio/wav' });
}

function mergeBuffers(recBuffers, recLength) {
    const result = new Float32Array(recLength)
    let offset = 0
    for (let i = 0; i < recBuffers.length; i++) {
        result.set(recBuffers[i], offset);
        offset += recBuffers[i].length;
    }
    return result;
}

function encodeWAV(samples, sampleRate) {
    let length = 44 + samples.byteLength / 2
    const buffer = new ArrayBuffer(length)
    const view = new DataView(buffer)

    /* RIFF identifier */
    writeString(view, 0, 'RIFF');
    /* file length */
    view.setUint32(4, 32 + samples.byteLength / 2, true);
    /* RIFF type */
    writeString(view, 8, 'WAVE');
    /* format chunk identifier */
    writeString(view, 12, 'fmt ');
    /* format chunk length */
    view.setUint32(16, 16, true);
    /* sample format (raw) */
    view.setUint16(20, 1, true);
    /* channel count */
    view.setUint16(22, 2, true);
    /* sample rate */
    view.setUint32(24, sampleRate, true);
    /* byte rate (sample rate * block align) */
    view.setUint32(28, sampleRate * 4, true);
    /* block align (channel count * bytes per sample) */
    view.setUint16(32, 4, true);
    /* bits per sample */
    view.setUint16(34, 16, true);
    /* data chunk identifier */
    writeString(view, 36, 'data');
    /* data chunk length */
    view.setUint32(40, samples.byteLength / 2, true);

    floatTo16BitPCM(view, 44, samples);

    return view;
}

function writeString(view, offset, string) {
    for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
    }
}

function floatTo16BitPCM(output, offset, input) {
    for (let i = 0; i < input.length; i++, offset += 2) {
        const s = Math.max(-1, Math.min(1, input[i]));
        output.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
    }
}

export default exportWAV;