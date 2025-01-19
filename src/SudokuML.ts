import { Board } from "./Board";
import { Row } from "./Row";
import { Sudoku } from "./Sudoku";

export class SudokuML {
  private generation: number;
  private iteration: number;
  private readonly iterations: number;
  private readonly logs: Array<{
    best_fitness: number;
    generation: number;
    iteration: number;
    mutationRate: number;
    worst_fitness: number;
  }>;
  private readonly mutationRate: number;
  private readonly population: Sudoku[];
  private readonly populationSize: number;

  constructor(
    private readonly board: number[][],
    {
      iterations = Infinity,
      mutationRate,
      populationSize,
    }: {
      iterations?: number;
      mutationRate: number;
      populationSize: number;
    }
  ) {
    this.generation = 1;
    this.iteration = 1;
    this.iterations = iterations;
    this.logs = [];
    this.mutationRate = mutationRate;
    this.population = [];
    this.populationSize = populationSize;
  }

  public run() {
    this.populate();
    while (
      this.iteration <= this.iterations &&
      this.population.at(0)!.validate() !== 0
    ) {
      this.handleStagnation();
      this.select();
      this.replicate();
      this.mutate();
      this.sort();
      this.log();
      this.generation++;
      this.iteration++;
    }
    this.print();
    return this.evaluate()
      ?.getBoard()
      .getRows()
      .map((row) => [...row.getRow()]);
  }

  private populate() {
    while (this.population.length < this.populationSize) {
      this.population.push(
        new Sudoku(new Board(this.board.map((row) => new Row([...row]))))
      );
    }
  }

  private replicate() {
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

  private handleStagnation() {
    if (
      this.iteration % 100 !== 0 ||
      new Set(this.logs.slice(-100).map((log) => log.best_fitness)).size > 1
    ) {
      return;
    }
    this.print();
    this.population.splice(0);
    this.populate();
    this.generation = 1;
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

  private log() {
    this.logs.push({
      best_fitness: this.population.at(0)!.validate(),
      generation: this.generation,
      iteration: this.iteration,
      mutationRate: this.mutationRate,
      worst_fitness: this.population.at(-1)!.validate(),
    });
  }

  private print() {
    console.log(
      [
        "{",
        [
          `"iteration":${this.logs.at(-1)?.iteration}`,
          `"generation":${this.logs.at(-1)?.generation}`,
          `"size":${this.population.length}`,
          `"best_fitness":${this.logs.at(-1)?.best_fitness}`,
          `"worst_fitness":${this.logs.at(-1)?.worst_fitness}`,
          `"mutation_rate":${this.logs.at(-1)?.mutationRate}`,
        ].join(","),
        "}",
      ].join("")
    );
  }
}
