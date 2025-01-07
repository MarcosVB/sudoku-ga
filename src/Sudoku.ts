import { Board } from "./Board";

export class Sudoku {
  constructor(private readonly board: Board) {}

  public getBoard() {
    return this.board;
  }

  public validate() {
    return this.validateColumns() + this.validateGrids();
  }

  private validateColumns(): number {
    let inconsistencies = 0;
    for (let i = 0; i < this.board.getSize(); i++) {
      const column: number[] = [];
      for (let j = 0; j < this.board.getRow(i).getSize(); j++) {
        column.push(this.board.getRow(j).getNumber(i));
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
            grid.push(this.board.getRow(row + i).getNumber(column + j));
          }
        }
        inconsistencies += 9 - new Set(grid).size;
      }
    }
    return inconsistencies;
  }
}
