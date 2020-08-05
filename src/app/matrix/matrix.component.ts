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
            <row #row *ngFor="let rowData of displayRowDatas, let i = index; let last = last"
                [rowData]="rowData"
                [isEditable]="isEditable"
                [isFithRow]="(i+1) % 5 == 0 && i < displayRowDatas.length-1"
                [isSixthRow]="(i) % 5 == 0 && i != 0"
                [thisRowIsBeingSolved]="!setByColumn && i == rowIndexToSet"
                [columnIsBeingSolved]="setByColumn"
                [columnIndexToSet]="columnIndexToSet"
                [rowIndex]="i"
                [isLast]="last"
                (CellAnimationEnd)="onCellAnimationEnd()">
            </row>
        </div><!-- [rowIndex]="rowIndexToSet" -->
    `
})
export class MatrixComponent{

    @Input() displayRowDatas: RowData[] = [];
    rowDatasToSet: RowData[] = [];
    setByColumn: boolean;
    rowIndexToSet;
    columnIndexToSet;

    @Input() isEditable: boolean;
    @Input() isResult: true;
    @Output() matrixSet = new EventEmitter();


    setRowDatasAnimted(inputRowDatas: RowData[], setByColumn: boolean)
    {
        if(inputRowDatas.length == 0) return;

        this.rowDatasToSet = inputRowDatas;
        this.setByColumn = setByColumn;

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
