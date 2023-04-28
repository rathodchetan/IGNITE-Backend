const express = require('express');

const app = express();
const routes = require('./routes/route.js');

var httpServer = require('http').Server(app);
var socketServer = require('socket.io')(httpServer);


require('dotenv').config();


app.use(express.json());
app.use('/api', routes);
app.use('/api/images/gif',express.static('images/gif/'));

ip = "192.168.56.1"
port = 3000

// app.listen(3000, () => {
//     console.log(`Server Started at ${3000}`)
// })

socketServer.on('connection', function (socket) {
    console.log("A Client has connected.");
    socket.on('disconnect', function () {
        console.log("A Client has disconnected.");
    });
});

httpServer.listen(port, ip, function () {
    console.log("Listening to " + ip + ":" + port);
});