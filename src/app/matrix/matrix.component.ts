import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CellData } from 'src/cellData';
import { RowData } from './../../rowData';
import { ClassField } from '@angular/compiler';

const BetterArray = require('better-array')

@Component({
    selector: 'matrix',
    styleUrls: ['./matrix.component.scss'],
    template: `
        <div id="matrixContainer"
            [class.isResult]="isResult"
            [style.width.px]="calculatedWidth">
            <cell *ngFor="let cd of cellDatas; let i = index"
                [cellData]="cd"
                [isFithRow]="cellIsFithRow(i)"
                [isSixthRow]="cellIsSxithRow(i)"
                [isFithColumn]="cellIsFithColumm(i)"
                [isSixthColumn]="cellIsSixthColumm(i)"
                [zIndex2]="glowOnIndices.contains(i) || glowOffIndices.contains(i)"
                [glowOn]="glowOnIndices.contains(i)"
                [glowOff]="glowOffIndices.contains(i)"
                [rowFirst]="!setByColumn && i == applyClipIndices.first()"
                [row]="!setByColumn && i != applyClipIndices.first() && i != applyClipIndices.last() && applyClipIndices.contains(i)"
                [rowLast]="!setByColumn && i == applyClipIndices.last()"
                [columnFirst]="setByColumn && i == applyClipIndices.first()"
                [column]="setByColumn && i != applyClipIndices.first() && i != applyClipIndices.last() && applyClipIndices.contains(i)"
                [columnLast]="setByColumn && i == applyClipIndices.last()"
                (CellGlowAnimationEnd)="onCellGlowAnimationEnd()"
                (CellContentAnimationEnd)="onCellAnimationEnd()">
            </cell>
        </div>
    `
})
export class MatrixComponent{

    cellDatas: CellData[];
    calculatedWidth: number;
    cellsPerRow: number;
    cellsPerColumn: number;
    @Input() set displayRowDatas(datas: RowData[])
    {
        this.cellDatas = [];
        datas.forEach(data => this.cellDatas = this.cellDatas.concat(data.cellDatas));

        this.calculatedWidth = datas[0].cellDatas.length * 32 + datas[0].cellDatas.length * 4;

        this.cellsPerRow = datas[0].cellDatas.length;
        this.cellsPerColumn = this.cellDatas.length / this.cellsPerRow;
    };
    rowDatasToSet: RowData[] = [];
    cellDatasToSet: CellData[];
    setByColumn: boolean;
    rowIndexToSet: number;
    columnIndexToSet: number;
    applyClipIndices = BetterArray([]);
    glowOnIndices = BetterArray([]);
    glowOffIndices = BetterArray([]);
    glowingCells = 0;

    matrixIsSet = false;

    @Input() isEditable: boolean;
    @Input() isResult: true;
    @Output() matrixSet = new EventEmitter();


    setRowDatasAnimated(inputRowDatas: RowData[], setByColumn: boolean)
    {
        if(inputRowDatas.length == 0) return;

        console.log('setRowDatasAnimated', inputRowDatas);

        this.rowDatasToSet = inputRowDatas;
        this.cellDatasToSet = [];
        inputRowDatas.forEach(data => this.cellDatasToSet = this.cellDatasToSet.concat(data.cellDatas));

        this.setByColumn = setByColumn;

        if(setByColumn){
            this.rowIndexToSet = 0;
            this.columnIndexToSet = 0;
        }else{
            this.rowIndexToSet = 0;
            this.columnIndexToSet = 0;
        }

        this.matrixIsSet = false;

        this.glowingCells = 0;
        this.glowOnIndices = BetterArray([]);
        this.glowOffIndices = BetterArray([]);
        this.calcRowColumnIndexToSet();

        //this.setNextCell();
    }

    calcRowColumnIndexToSet()
    {
        if(this.setByColumn)
        {
            let isDiff = false;
            do{
                for(let col = this.columnIndexToSet; col < this.rowDatasToSet[0].cellDatas.length; col++)
                {
                    for(let row = 0; row < this.rowDatasToSet.length; row++)
                    {
                        const inputCell = this.cellDatasToSet[row * this.cellsPerRow + col];
                        const cellToSet = this.cellDatas[row * this.cellsPerRow + col];

                        console.log('checking', col, row);

                        if(inputCell.status != cellToSet.status)
                        {
                            console.log('found dif');
                            isDiff = true;
                            this.columnIndexToSet = col;
                            this.rowIndexToSet = row;
                            break;
                        }
                    }
                    if(isDiff) break;
                }
                if(!isDiff)
                    this.matrixIsSet = true;

            }while(!isDiff && !this.matrixIsSet);
        }
        else
        {
            let isDiff = false;
            do{
                for(let row = this.rowIndexToSet; row < this.rowDatasToSet.length; row++)
                {
                    for(let col = 0; col < this.rowDatasToSet[0].cellDatas.length; col++)
                    {
                        const inputCell = this.cellDatasToSet[row * this.cellsPerRow + col];
                        const cellToSet = this.cellDatas[row * this.cellsPerRow + col];

                        if(inputCell.status != cellToSet.status)
                        {
                            isDiff = true;
                            this.columnIndexToSet = col;
                            this.rowIndexToSet = row;
                            break;
                        }
                    }
                    if(isDiff) break;
                }
                if(!isDiff)
                    this.matrixIsSet = true;

            }while(!isDiff && !this.matrixIsSet);
        }

        if(this.matrixIsSet)
        {
            console.log('matrix is set');
            this.setGlowOffIndices();
            return;
        }

        const cellIndexToSet = this.rowIndexToSet * this.cellsPerRow + this.columnIndexToSet;
        if(!this.glowOnIndices.contains(cellIndexToSet))
        {
            if(this.glowOnIndices.size() > 0)
            {
                this.setGlowOffIndices();
                return;
            }
            else
            {
                this.setGlowOnIndices();
                return;
            }
        }
        else{
            this.setCell();
        }
    }

    setCell()
    {
        const inputCell = this.cellDatasToSet[this.rowIndexToSet * this.cellsPerRow + this.columnIndexToSet];
        const cellToSet = this.cellDatas[this.rowIndexToSet * this.cellsPerRow + this.columnIndexToSet];
        cellToSet.status = inputCell.status;
    }

    onCellAnimationEnd()
    {
        //console.log('onCellAnimationEnd');
        this.calcRowColumnIndexToSet();
    }

    onCellGlowAnimationEnd()
    {
        if(this.glowOnIndices.size() > 0)
        {
            this.glowingCells++;
            //console.log(this.glowingCells, this.glowOnIndices.size());

            if(this.glowingCells == this.glowOnIndices.size())
            {
                this.setCell();
            }
        }
        else
        {
            this.glowingCells--;
            if(this.glowingCells == 0)
            {
                if(this.matrixIsSet)
                {
                    this.applyClipIndices = BetterArray([]);
                    this.matrixSet.emit();
                    return;
                }
                else
                {
                    this.setGlowOnIndices();
                }
            }
        }
    }

    setGlowOnIndices()
    {
        if(!this.setByColumn)
        {
            for(let i = 1; i <= this.cellsPerRow; i++)
                this.glowOnIndices.$push(i + (this.rowIndexToSet * this.cellsPerRow) - 1);
        }
        else
        {
            for(let i = 0; i < this.cellDatasToSet.length / this.cellsPerRow; i++)
            {
                this.glowOnIndices.$push(this.columnIndexToSet + (i * this.cellsPerRow))
            }
        }
        this.applyClipIndices = this.glowOnIndices;
    }

    setGlowOffIndices()
    {
        this.glowOffIndices = this.glowOnIndices;
        this.glowOnIndices = BetterArray([]);
    }

    cellIsFithRow(i: number)
    {
        const row = Math.floor(i / this.cellsPerRow);
        if((row + 1) % 5 == 0 && i < this.cellDatas.length - this.cellsPerRow)
            return true;
    }

    cellIsSxithRow(i: number)
    {
        const row = Math.floor(i / this.cellsPerRow);
        if(row % 5 == 0 && i > this.cellsPerRow)
            return true;
    }

    cellIsFithColumm(i: number)
    {
        const row = Math.floor(i / this.cellsPerRow);
        if((i + 1) % 5 == 0 && i < (((row + 1) * this.cellsPerRow) - 1) )
            return true;
    }

    cellIsSixthColumm(i: number)
    {
        const row = Math.floor(i / this.cellsPerRow);
        if(i % 5 == 0 && i > row * this.cellsPerRow )
            return true;
    }

    cellIsFithColumn(i: number)
    {
        if((i + 1) % 5 == 0)
            return true;
    }

    async delay(ms: number)
    {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

}
