import { SudokuML } from "./SudokuML";

const board: number[][] = [
  [0, 0, 0, 1, 0, 2, 0, 0, 0],
  [0, 6, 0, 0, 0, 0, 0, 7, 0],
  [0, 0, 8, 0, 0, 0, 9, 0, 0],
  [4, 0, 0, 0, 0, 0, 0, 0, 3],
  [0, 5, 0, 0, 0, 7, 0, 0, 0],
  [2, 0, 0, 0, 8, 0, 0, 0, 1],
  [0, 0, 9, 0, 0, 0, 8, 0, 5],
  [0, 7, 0, 0, 0, 0, 0, 6, 0],
  [0, 0, 0, 3, 0, 4, 0, 0, 0],
];
const sudokuML = new SudokuML(board, {
  populationSize: 1000,
  generations: 400,
  mutationRate: 0.01,
});
sudokuML.run();
