import { RowData } from './rowData';

export class ResultMatrices{
    resultMatrices: RowData[][] = [];

    push(rowData: RowData[])
    {
        this.resultMatrices.push(rowData);
    }

    last(): RowData[]
    {
        if(this.resultMatrices.length == 0)
            return undefined;
        else
            return this.resultMatrices[this.resultMatrices.length - 1];
    }

    get length(){
        return this.resultMatrices.length;
    }
}