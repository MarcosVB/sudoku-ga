import { Row } from "./Row";

export class Board {
  private readonly rows: Row[];

  constructor(rows: Row[]) {
    this.rows = rows;
  }

  public getSize() {
    return this.rows.length;
  }

  public getRow(index: number) {
    return this.rows[index];
  }

  public getRows() {
    return this.rows;
  }
}
