const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" } // vėliau pakeisk į savo Railway URL saugumui
});

app.use(express.static(path.join(__dirname)));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

let activeUsers = 0;

io.on('connection', (socket) => {
  console.log('Naujas vartotojas prisijungė');
  activeUsers++;
  io.emit('userCount', activeUsers);

  socket.on('disconnect', () => {
    console.log('Vartotojas atsijungė');
    activeUsers = Math.max(0, activeUsers - 1);
    io.emit('userCount', activeUsers);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Serveris veikia porto ${PORT}`);
});