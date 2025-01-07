import { Sudoku } from "./Sudoku";

export class SudokuML {
  private readonly population: Sudoku[];

  constructor(
    private readonly populationSize: number,
    private readonly mutationRate: number
  ) {
    this.population = [];
  }

  public run() {
    let generation = 1;
    this.populate();
    while (!this.evaluate()) {
      this.select();
      this.repopulate();
      this.mutate();
      console.log(
        `Generation: ${generation++}, Best fitness: ${
          this.population.map((a) => a.validate())[0]
        }, Population size: ${this.population.length}`
      );
    }
    console.log(JSON.stringify(this.evaluate()));
  }

  private populate() {
    while (this.population.length < this.populationSize) {
      this.population.push(new Sudoku());
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
      const newSudoku = new Sudoku();
      newSudoku.setBoard(JSON.parse(JSON.stringify(sudoku.getBoard())));
      const row = Math.floor(Math.random() * sudoku.getBoard().length);
      this.swap(
        sudoku.getBoard()[row],
        Math.floor(Math.random() * sudoku.getBoard()[row].length),
        Math.floor(Math.random() * sudoku.getBoard()[row].length)
      );
      newPopulation.push(newSudoku);
      i++;
    }
    this.population.push(...newPopulation);
  }

  private select() {
    this.population.sort(this.compare);
    this.population.splice(this.population.length / 2);
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
      sudoku.getBoard().forEach((row) => {
        if (Math.random() < this.mutationRate) {
          this.swap(
            row,
            Math.floor(Math.random() * row.length),
            Math.floor(Math.random() * row.length)
          );
        }
      });
    });
  }

  private evaluate() {
    return this.population.find((sudoku) => sudoku.validate() === 0);
  }

  private swap(row: number[], a: number, b: number) {
    const temp = row[a];
    row[a] = row[b];
    row[b] = temp;
  }
}
