module.exports = function () {

    const resources = {
        minerals: 0,
        goods: 0,
        economy: 0
    };

    return {
        get,
        set
    };

    function get() {
        return { ...resources };
    }

    function set(type, value) {
        resources[type] = value;
    }
};