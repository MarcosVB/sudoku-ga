export class Sudoku {
  protected board: number[][];

  constructor() {
    this.board = this.createBoard();
  }

  public setBoard(board: number[][]) {
    this.board = board;
  }

  public getBoard() {
    return this.board;
  }

  private createBoard(): number[][] {
    return [
      this.createRow(),
      this.createRow(),
      this.createRow(),
      this.createRow(),
      this.createRow(),
      this.createRow(),
      this.createRow(),
      this.createRow(),
      this.createRow(),
    ];
  }

  private createRow(): number[] {
    return [1, 2, 3, 4, 5, 6, 7, 8, 9].sort(() => Math.random() - 0.5);
  }

  public validate() {
    return this.validateColumns() + this.validateGrids();
  }

  private validateColumns(): number {
    let inconsistencies = 0;
    for (let i = 0; i < this.board.length; i++) {
      const column: number[] = [];
      for (let j = 0; j < this.board[i].length; j++) {
        column.push(this.board[j][i]);
      }
      inconsistencies += 9 - new Set(column).size;
    }
    return inconsistencies;
  }

  private validateGrids(): number {
    let inconsistencies = 0;
    for (let row = 0; row < 9; row += 3) {
      for (let column = 0; column < 9; column += 3) {
        const grid: number[] = [];
        for (let i = 0; i < 3; i++) {
          for (let j = 0; j < 3; j++) {
            grid.push(this.board[row + i][column + j]);
          }
        }
        inconsistencies += 9 - new Set(grid).size;
      }
    }
    return inconsistencies;
  }
}
