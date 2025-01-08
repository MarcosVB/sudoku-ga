export class Row {
  private readonly row: number[];
  private readonly fixed: Set<number>;

  constructor(row: number[], fixed?: Set<number>) {
    if (row.length !== 9) {
      throw new Error(`Invalid row size: ${row.length}`);
    }
    this.row = row;
    this.fixed = fixed ?? new Set();
    const availableNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9]
      .filter((value) => row.indexOf(value) === -1)
      .sort(() => Math.random() - 0.5);
    this.row.forEach((value, index) => {
      if (value < 0 || value > 9) {
        throw new Error(`Invalid input: ${value}`);
      }
      if (value !== 0) {
        !fixed && this.fixed.add(index);
      } else {
        this.row[index] = availableNumbers.shift()!;
      }
    });
  }

  public getSize() {
    return this.row.length;
  }

  public getNumber(index: number) {
    return this.row[index];
  }

  public swap() {
    // Considering a 9x9 board
    if (this.fixed.size > 7) {
      return;
    }
    const swappableIndexes = [0, 1, 2, 3, 4, 5, 6, 7, 8]
      .filter((index) => !this.fixed.has(index))
      .sort(() => Math.random() - 0.5);
    const [base, target] = swappableIndexes;
    const temp = this.row[base];
    this.row[base] = this.row[target];
    this.row[target] = temp;
  }

  public clone() {
    return new Row([...this.row], new Set([...this.fixed]));
  }
}
