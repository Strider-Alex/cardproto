// src/server.js
const Server = require('boardgame.io/server').Server;
const Game = require('./game').default;
const server = Server({ games: [Game] });
server.run(8000);
