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

export const GAMEMODE = new GameMode();
