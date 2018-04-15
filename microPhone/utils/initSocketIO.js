module.exports = function () {
    return new Promise(resolve => {
        const socketIoScript = document.createElement('script');
        socketIoScript.setAttribute('src', '/socket.io/socket.io.js');
        socketIoScript.async = false;
        document.body.appendChild(socketIoScript);
        socketIoScript.addEventListener('load', () => {
            resolve();
        });
    });
}