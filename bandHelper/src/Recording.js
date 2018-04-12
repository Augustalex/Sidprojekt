export default function ({ title, src }) {

    let childTracks = [];

    return {
        addSubTrack(track) {
            childTracks.push(track);
        },
        getChildTracks: () => [...childTracks]
    }
}