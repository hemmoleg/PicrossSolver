import { CellData, CellStatus } from './cellData';

export class BlockPlacmentResult{
    
    constructor(public testRow: CellData[], 
            public continueAtIndex: number){}

    get numCellsFilled(): number
    {
        let count = 0;
        this.testRow.forEach(cell => 
            cell.status == CellStatus.filled ? count++ : null);
        return count;
    }
}