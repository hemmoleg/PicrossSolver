export class CellData{
    status: CellStatus = CellStatus.empty;
    isHard = false;
}

export enum CellStatus{
    empty,
    filled,
    cross
}