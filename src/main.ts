import { Board } from "./Board";
import { Row } from "./Row";
import { SudokuML } from "./SudokuML";

const board = new Board([
  new Row([0, 0, 2, 3, 1, 7, 8, 6, 9]),
  new Row([8, 7, 0, 5, 9, 4, 1, 2, 3]),
  new Row([3, 9, 1, 0, 0, 0, 0, 5, 7]),
  new Row([1, 2, 0, 8, 5, 9, 3, 7, 6]),
  new Row([6, 8, 0, 0, 3, 0, 0, 9, 4]),
  new Row([9, 3, 0, 0, 4, 2, 5, 8, 1]),
  new Row([5, 1, 0, 0, 6, 8, 7, 4, 2]),
  new Row([2, 6, 0, 4, 7, 3, 9, 1, 5]),
  new Row([7, 4, 9, 1, 2, 5, 6, 0, 0]),
]);
const sudokuML = new SudokuML(board, 100, 0.01);
sudokuML.run();
