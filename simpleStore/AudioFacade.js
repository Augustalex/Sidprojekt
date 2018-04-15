const VIEW_ID = 'audioFile.view';

module.exports = function (simpleStore) {

    let view = {};

    return {
        loadView,
        store,
        get,
        list,
        saveView
    };

    async function loadView() {
        try {
            view = await simpleStore.get(VIEW_ID);
        }
        catch (ex) {
            await simpleStore.store('view', view, VIEW_ID);
        }
    }

    async function store(buffer, metadata) {
        let audioId = await simpleStore.storeBinary(buffer);
        view[audioId] = metadata;
        return audioId;
    }

    async function get(id) {
        const buffer = await simpleStore.getBinary(id);
        return {
            id,
            metadata: view[id],
            buffer
        }
    }

    function list() {
        return Object.keys(view).map(audioId => {
            return {
                id: audioId,
                metadata: jsonDeepClone(view[audioId])
            }
        });
    }

    async function saveView() {
        await simpleStore.store('audioFileView', view, VIEW_ID);
    }

    function jsonDeepClone(obj) {
        return JSON.parse(JSON.stringify(obj));
    }
};