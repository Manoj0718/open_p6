// const https = require('https'); // we installed node package & this is default. now we’ll gonna create the server.
const http = require('http');
const app = require('./app');
//? to handle ssl certificate//
const fs = require('fs');
//? path , filesync function need this //
const path = require('path');


const normalizePort = val => {
    const port = parseInt(val, 10);

    if (isNaN(port)) {
        return val;
    }
    if (port >= 0) {
        return port;
    }
    return false;
};
const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

const errorHandler = error => {
    if (error.syscall !== 'listen') {
        throw error;
    }
    const address = server.address();
    const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges.');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use.');
            process.exit(1);
            break;
        default:
            throw error;
    }
};

const server = http.createServer(app);

//? HTTPS -  https://www.sitepoint.com/how-to-use-ssltls-with-node-js/ 

//TODO : here i add the ssl and tried to run the https , to make sure  secure data transport //

// const server = https.createServer(
//     {
//         cert: fs.readFileSync(path.join(__dirname, './ssl', 'cert.pem')),
//         key: fs.readFileSync(path.join(__dirname, './ssl', 'key.pem')),
//     }, (req, res) => { res.end(`<h1> hellow Now you are useing HTTPS</h1>`) }, app);
// console.log(server, 'server finish from here');
// console.log(https);

server.on('error', errorHandler);
server.on('listening', () => {
    const address = server.address();
    const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
    console.log('Listening on ' + bind);
});

server.listen(port, () => console.log('secure port http'));

