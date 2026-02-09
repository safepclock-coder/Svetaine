const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: { origin: '*' }  // Leidžia prieigą iš bet kur (gamyboje apribokite)
});

// Tarnaukite statinius failus (HTML, CSS, JS)
app.use(express.static(__dirname));

// Pradinis puslapis – index.html
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

let activeUsers = 0;  // Aktyvių vartotojų skaitliukas

io.on('connection', (socket) => {
    activeUsers++;  // Naujas vartotojas prisijungė
    io.emit('userCount', activeUsers);  // Siunčiame skaičių visiems klientams

    socket.on('disconnect', () => {
        activeUsers--;  // Vartotojas atsijungė
        io.emit('userCount', activeUsers);  // Atnaujiname visiems
    });
});

const PORT = process.env.PORT || 3000;  // BŪTINA!
server.listen(PORT, '0.0.0.0', () => {  // Pridėk '0.0.0.0' host'ą!
    console.log(`Server listening on port ${PORT}`);
});
