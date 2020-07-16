import { CellData, CellStatus } from './cellData';

export class RowData{

    constructor(public cellData ?: CellData[], similiarities?: number[], length?: number){
        if(!cellData)
            this.cellData = new Array();

        if(similiarities)
            for(let i = 0; i < length; i++)
            {
                this.cellData.push(new CellData());
                if(similiarities.includes(i))
                {
                    this.cellData[i].status = CellStatus.filled;
                    this.cellData[i].isHard = true;
                }
            }
    }
}
