import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CellData } from 'src/cellData';
import { RowData } from './../../rowData';
import { ClassField } from '@angular/compiler';

@Component({
    selector: 'matrix',
    styleUrls: ['./matrix.component.scss'],
    template: `
        <div id="matrixContainer"
            [class.isResult]="isResult">
            <row #row *ngFor="let rowData of displayRowDatas, let i = index"
                [rowData]="rowData"
                [isEditable]="isEditable"
                [isFithRow]="(i+1) % 5 == 0 && i < displayRowDatas.length-1"
                [isSixthRow]="(i) % 5 == 0 && i != 0"
                (CellAnimationEnd)="onCellAnimationEnd()">
            </row>
        </div>
    `
})
export class MatrixComponent{

    @Input() displayRowDatas: RowData[] = [];
    rowDatasToSet: RowData[] = [];
    setByColumn: boolean;
    rowIndexToSet = 0;
    columnIndexToSet = 0;

    @Input() isEditable: boolean;
    @Input() isResult: true;
    @Output() matrixSet = new EventEmitter();


    setRowDatasAnimted(inputRowDatas: RowData[], setByColumn: boolean)
    {
        if(inputRowDatas.length == 0) return;
        //this.setRowDatas(inputRowDatas);
        this.rowDatasToSet = inputRowDatas;
        this.setByColumn = setByColumn;

        for(let i = 0; i < inputRowDatas.length; i++)
        {
            if(!this.displayRowDatas[i])
            {
                this.displayRowDatas[i] = inputRowDatas[i];
                continue;
            }
        }

        if(setByColumn){
            this.rowIndexToSet = -1;
            this.columnIndexToSet = 0;
        }else{
            this.rowIndexToSet = 0;
            this.columnIndexToSet = -1;
        }

        this.setNextCell();
    }

    setNextCell()
    {
        if(this.setByColumn){
            if(this.rowIndexToSet == this.rowDatasToSet.length - 1)
            {
                this.columnIndexToSet++;
                this.rowIndexToSet = 0;
            }
            else
            {
                this.rowIndexToSet++;
            }

            if(this.columnIndexToSet >= this.rowDatasToSet[0].cellDatas.length)
            {
                this.matrixSet.emit();
                return;
            }
        }else{
            if(this.columnIndexToSet == this.rowDatasToSet[0].cellDatas.length - 1)
            {
                this.rowIndexToSet++;
                this.columnIndexToSet = 0;
            }
            else
            {
                this.columnIndexToSet++;
            }

            if(this.rowIndexToSet >= this.rowDatasToSet.length)
            {
                this.matrixSet.emit();
                return;
            }
        }

        //console.log('setNextCell', this.rowIndexToSet, this.columnIndexToSet);

        const inputCell = this.rowDatasToSet[this.rowIndexToSet].cellDatas[this.columnIndexToSet];
        const cellToSet = this.displayRowDatas[this.rowIndexToSet].cellDatas[this.columnIndexToSet];

        if(inputCell.status != cellToSet.status)
            cellToSet.status = inputCell.status;
        else
            this.setNextCell();
    }

    onCellAnimationEnd()
    {
        this.setNextCell();
    }

    async delay(ms: number)
    {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

}
