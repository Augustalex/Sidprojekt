let actionKeysActive = new Set();
let previousKeysDown = new Set();
let newKeysDown = new Set();
const wasReleased = (actionKey, keymap) => keymap[actionKey].some(key => previousKeysDown.has(key) && !newKeysDown.has(key));
const wasPressed = (actionKey, keymap) => keymap[actionKey].some(key => !previousKeysDown.has(key) && newKeysDown.has(key));

let keyboardState = new Set();

let inputDependencies = {
    wasReleased,
    wasPressed,
    keysDown: actionKeysActive
};

let hooks = [];

export default {
    addHook: hook => hooks.push(hook),
    updateInput
};

function updateInput(hookDependencies) {
    previousKeysDown = newKeysDown;
    newKeysDown = new Set();
    readKeyboardState();
    for (let hook of hooks) {
        hook(inputDependencies, hookDependencies)
    }
}

function readKeyboardState() {
    for (let key of [...keyboardState]) {
        newKeysDown.add(key)
    }
}

window.addEventListener('keydown', e => {
    keyboardState.add(e.key.toLowerCase())
});

window.addEventListener('keyup', e => {
    keyboardState.delete(e.key.toLowerCase())
});