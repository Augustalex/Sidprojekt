export default function ({ audio }) {
    return new Promise((resolve, reject) => {
        navigator.getUserMedia({ audio }, resolve, reject);
    });
}