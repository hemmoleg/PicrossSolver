import { CellData, CellStatus } from './cellData';

export class RowData{

    constructor(public cellDatas ?: CellData[], similiarities?: number[], length?: number){
        if(!cellDatas)
            this.cellDatas = new Array();

        if(similiarities)
            for(let i = 0; i < length; i++)
            {
                this.cellDatas.push(new CellData());
                if(similiarities.includes(i))
                {
                    this.cellDatas[i].status = CellStatus.filled;
                    this.cellDatas[i].isHard = true;
                }
            }
    }

    getCellsFilledOrCrossedCount(): number
    {
        let cellsFilledOrCrossedCount = 0;
        this.cellDatas.forEach(cell => cell.status == CellStatus.filled || cell.status == CellStatus.cross ? cellsFilledOrCrossedCount++ : undefined);
        return cellsFilledOrCrossedCount;
    }
}
