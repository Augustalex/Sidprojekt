export default function (player, { speed }) {

    return {
        moveUp,
        dampUp,
        moveDown,
        dampDown,
        moveLeft,
        dampLeft,
        moveRight,
        dampRight,
        updatePosition
    }

    function moveUp() {
        player.velocity.y = -speed;
    }

    function dampUp() {
        player.velocity.y = player.velocity.y < 0 ? 0 : player.velocity.y;
    }

    function moveDown() {
        player.velocity.y = speed;
    }

    function dampDown() {
        player.velocity.y = player.velocity.y > 0 ? 0 : player.velocity.y
    }

    function moveLeft() {
        player.velocity.x = -speed;
    }

    function dampLeft() {
        player.velocity.x = player.velocity.x < 0 ? 0 : player.velocity.x;
    }

    function moveRight() {
        player.velocity.x = speed;
    }

    function dampRight() {
        player.velocity.x = player.velocity.x > 0 ? 0 : player.velocity.x;
    }

    function updatePosition(delta) {
        player.position = {
            x: player.position.x + player.velocity.x * delta,
            y: player.position.y + player.velocity.y * delta
        }
    }
};