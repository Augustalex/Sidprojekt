module.exports = function (url) {

    let [path, query] = url.split('?');

    return {
        path,
        query
    };
};