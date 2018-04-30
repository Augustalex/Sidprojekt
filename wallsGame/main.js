import {$} from './utils/query.js';
import PlayerDrawer from './PlayerDrawer.js';
import PlayerMover from './PlayerMover.js';
import inputController from './inputController.js';

export default function () {
    const canvas = $('#canvas');
    canvas.width = Math.round(window.innerWidth * .96);
    canvas.height = Math.round(window.innerHeight * .96);

    const player = {
        position: {
            x: 100,
            y: 100
        },
        style: {
            width: 10,
            height: 10,
            color: 'red'
        },
        velocity: {
            x: 0,
            y: 0
        },
        keymap: {
            'up': ['w'],
            'down': ['s'],
            'left': ['a'],
            'right': ['d'],
        }
    }

    const playerMover = PlayerMover(player, { speed: 10 });

    const playerDrawer = PlayerDrawer();
    playerDrawer.addPlayer(player);

    inputController.addHook(({ wasPressed: wasPressedForKeymap, wasReleased: wasReleasedForKeymap }) => {
        const wasPressed = (actionKey) => wasPressedForKeymap(actionKey, player.keymap);
        const wasReleased = (actionKey) => wasReleasedForKeymap(actionKey, player.keymap);

        if (wasPressed('up')) {
            playerMover.moveUp();
        }
        else if (wasReleased('up')) {
            playerMover.dampUp();
        }

        if (wasPressed('down')) {
            playerMover.moveDown();
        }
        else if (wasReleased('down')) {
            playerMover.dampDown();
        }

        if (wasPressed('left')) {
            playerMover.moveLeft();
        }
        else if (wasReleased('left')) {
            playerMover.dampLeft();
        }

        if (wasPressed('right')) {
            playerMover.moveRight();
        }
        else if (wasReleased('right')) {
            playerMover.dampRight();
        }
    });

    const context = canvas.getContext('2d');
    const loop = () => {
        const delta = .16;
        context.clearRect(0, 0, canvas.width, canvas.height);
        inputController.updateInput({});

        playerMover.updatePosition(delta);

        playerDrawer.drawAll({ canvas, context });

        requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);
}