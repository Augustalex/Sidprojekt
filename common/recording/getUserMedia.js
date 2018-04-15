module.exports = function ({ audio }) {
    return new Promise((resolve, reject) => {
        navigator.getUserMedia({ audio }, resolve, reject);
    });
}