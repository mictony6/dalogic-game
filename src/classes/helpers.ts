export function isTileWhite(row: number, column: number){
  return (row + column) % 2 === 0;
}

