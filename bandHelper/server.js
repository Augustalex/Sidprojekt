let http = require('http');
let express = require('express');
let app = express();

let readFile = require('../common/readFile.js');
app.get('/', () => {
    console.log('someone is requesting a get!');
});
app.use(express.static('./dist'));
app.listen(3000, '0.0.0.0');