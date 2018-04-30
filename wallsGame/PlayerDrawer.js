export default function PlayerDrawer() {

    const players = [];

    return {
        addPlayer,
        drawAll
    };

    function addPlayer(player) {
        players.push(player);
    }

    function drawAll({ context }) {
        for (let player of players) {
            const { x, y } = player.position;
            const { width, height, color } = player.style;
            context.fillStyle = color;
            context.fillRect(x, y, width, height);
        }
    }
}