import { io } from "socket.io-client";

export function isTileWhite(row: number, column: number) {
  return (row + column) % 2 === 0;
}

class GameMode {
  constructor(
    public PlayerVsPlayer = 0,
    public PlayerVsAI = 1,
    public AIVsAI = 3,
  ) {}
}
// socket connection
export const socket = io("http://localhost:3000");
export const GAMEMODE = new GameMode();
