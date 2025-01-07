import { Board } from "./Board";
import { Sudoku } from "./Sudoku";

export class SudokuML {
  private readonly population: Sudoku[];

  constructor(
    private readonly board: Board,
    private readonly populationSize: number,
    private readonly generations: number,
    private readonly mutationRate: number
  ) {
    this.population = [];
  }

  public run() {
    let generation = 1;
    this.populate();
    do {
      this.select();
      this.repopulate();
      this.mutate();
      this.sort();
      this.log(generation++);
    } while (
      generation !== this.generations + 1 &&
      this.population.at(0)!.validate() !== 0
    );
    console.log(JSON.stringify(this.evaluate()));
  }

  private populate() {
    while (this.population.length < this.populationSize) {
      this.population.push(new Sudoku(this.board.clone()));
    }
  }

  private repopulate() {
    const newPopulation: Sudoku[] = [];
    let i = 0;
    while (
      this.population.length + newPopulation.length <
      this.populationSize
    ) {
      const sudoku = this.population[i % this.population.length];
      const newSudoku = new Sudoku(this.board.clone());
      const row = Math.floor(Math.random() * sudoku.getBoard().getSize());
      newSudoku.getBoard().getRow(row).swap();
      newPopulation.push(newSudoku);
      i++;
    }
    this.population.push(...newPopulation);
  }

  private select() {
    this.sort();
    this.population.splice(this.population.length / 2);
  }

  private sort() {
    this.population.sort(this.compare);
  }

  private compare(base: Sudoku, target: Sudoku) {
    const baseValidation = base.validate();
    const targetValidation = target.validate();
    if (baseValidation < targetValidation) {
      return -1;
    }
    return baseValidation > targetValidation ? 1 : 0;
  }

  private mutate() {
    this.population.forEach((sudoku) => {
      sudoku
        .getBoard()
        .getRows()
        .forEach((row) => {
          if (Math.random() < this.mutationRate) {
            row.swap();
          }
        });
    });
  }

  private evaluate() {
    return this.population.find((sudoku) => sudoku.validate() === 0);
  }

  private log(generation: number) {
    console.log(
      [
        `generation: ${generation}`,
        `population: ${this.population.length}`,
        `best_fitness: ${this.population.at(0)!.validate()}`,
        `worst_fitness: ${this.population.at(-1)!.validate()}`,
      ].join(", ")
    );
  }
}
