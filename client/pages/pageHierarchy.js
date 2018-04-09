const HOME = 'Home';
const PLANETS = 'Planets';

module.exports = {
    [HOME]: [
        PLANETS,
    ],
    [PLANETS]: [
        HOME
    ],
    'standalone_page': [
        HOME
    ]
};