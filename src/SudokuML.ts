import { Board } from "./Board";
import { Row } from "./Row";
import { Sudoku } from "./Sudoku";

export class SudokuML {
  private readonly generations: number;
  private readonly mutationRate: number;
  private readonly population: Sudoku[];
  private readonly populationSize: number;
  private generation: number;

  constructor(
    private readonly board: number[][],
    {
      generations = Infinity,
      mutationRate,
      populationSize,
    }: {
      generations?: number;
      mutationRate: number;
      populationSize: number;
    }
  ) {
    this.generation = 1;
    this.generations = generations;
    this.mutationRate = mutationRate;
    this.population = [];
    this.populationSize = populationSize;
  }

  public run() {
    this.populate();
    while (
      this.generation <= this.generations &&
      this.population.at(0)!.validate() !== 0
    ) {
      this.select();
      this.repopulate();
      this.mutate();
      this.sort();
      this.log(this.generation++);
    }
    console.log(JSON.stringify(this.evaluate()?.getBoard().toString()));
  }

  private populate() {
    while (this.population.length < this.populationSize) {
      this.population.push(
        new Sudoku(new Board(this.board.map((row) => new Row([...row]))))
      );
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
      const newSudoku = new Sudoku(sudoku.getBoard().clone());
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
        "{",
        [
          `"generation":${generation}`,
          `"population":${this.population.length}`,
          `"best_fitness":${this.population.at(0)!.validate()}`,
          `"worst_fitness":${this.population.at(-1)!.validate()}`,
        ].join(","),
        "}",
      ].join("")
    );
  }
}
