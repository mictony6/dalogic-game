const express = require("express");
const app = express();
const port = 3000;
const path = require("path");
const socketIO = require("socket.io");
const http = require("http");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "build")));

/* GET home page. */
app.get("/", function (req, res, next) {
  res.sendFile(path.join(process.cwd(), "build/index.html"));
});

// app.listen(port, () => {
//   console.log(`Dalogic app listening at http://localhost:${port}`);
// });

const server = http.createServer(app);
const io = new socketIO.Server(server);

let players = [];
let readyPlayers = [];

function isTileWhite(row, column) {
  return (row + column) % 2 === 0;
}

function generateGameData(rows, columns) {
  let player1 = readyPlayers[0];
  let player2 = readyPlayers[1];

  //generate Pieces
  let p1Pieces = [];
  let p2Pieces = [];

  for (let row = 0; row < (rows - 2) / 2; row++) {
    for (let col = 0; col < columns; col++) {
      if (isTileWhite(row, col)) {
        const piece = {
          row: row,
          column: col,
          value: Math.floor(Math.random() * 3),
          playerId: readyPlayers[0],
        };
        p1Pieces.push(piece);

        const piece2 = {
          row: row,
          column: col,
          value: Math.floor(Math.random() * 3),
          playerId: readyPlayers[1],
        };

        p2Pieces.push(piece2);
      }
    }
  }

  return { pieces: [...p1Pieces, ...p2Pieces], currentPlayer: readyPlayers[0] };
}

io.on("connection", (socket) => {
  console.log(`connect ${socket.id}`);

  socket.on("joinGame", () => {
    socket.emit("joinSuccess", socket.id);
  });

  // Store player information on connection
  socket.on("findMatch", (playerData) => {
    players.push({
      id: socket.id,
      ...playerData,
    });

    // Try to match players when a new player joins
    matchPlayers();
  });

  socket.on("playerReady", (data) => {
    readyPlayers.push(data.playerId);
    if (readyPlayers.length === 2) {
      let gameData = generateGameData(data.rows, data.columns);

      readyPlayers.forEach((playerId) => {
        io.to(playerId).emit("startGame", gameData);
      });
      readyPlayers = [];
    }
  });

  socket.on("stateChange", (stateData) => {
    console.log(stateData);
  });

  socket.on("move", (moveData) => {
    // invert the row and column of the move to be on the other side of the board
    moveData.srcPos.row = 7 - moveData.srcPos.row;
    moveData.srcPos.column = 7 - moveData.srcPos.column;
    moveData.destPos.row = 7 - moveData.destPos.row;
    moveData.destPos.column = 7 - moveData.destPos.column;
    socket.broadcast.emit("move", moveData);
  });

  socket.on("disconnect", (reason) => {
    // Remove player from players array
    players = players.filter((player) => player.id !== socket.id);
    console.log(`disconnect ${socket.id} due to ${reason}`);
  });
});

// Matchmaking function
function matchPlayers() {
  // Implement your matchmaking logic here
  // In this example, just match the first two available players
  if (players.length >= 2) {
    const matchedPlayers = players.splice(0, 2);
    // Notify matched players
    matchedPlayers.forEach((player) => {
      io.to(player.id).emit("matchFound", matchedPlayers);
    });
  }
}

server.listen(port, () => {
  console.log(`Dalogic app listening at http://localhost:${port}`);
});
