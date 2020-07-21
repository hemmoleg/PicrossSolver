import { Component, OnInit, ViewChildren, QueryList } from '@angular/core';
import { CellData, CellStatus } from '../cellData';
import { RowData } from '../rowData';
import { Solver } from '../solver';
import { ResultMatrices } from '../resultMatrices';

import { CollumnRowInputComponent } from './collumn-row-input/collumn-row-input.component';

@Component({
  selector: 'app-root',
  styleUrls: ['./app.component.scss', './cell/cell.component.scss'],
  template: `
        <matrixinput
            (btnCreateClicked)="btnCreateClicked($event)">
        </matrixinput>

        <div style="text-align: center">
            <div *ngIf="rowDatas.length > 0" id="flex">
                <div id="topLeftDiv" class="flexChild">
                </div>
                <div id="topRightDiv" class="flexChild">
                    <column-row-input #columnInput
                        *ngFor="let item of rowDatas[0].cellData; let i = index;"
                        [isColumn]="true"
                        [index]="i">
                    </column-row-input>
                </div>
                <div id="botLeftDiv" class="flexChild">
                    <div *ngFor="let item of rowDatas; let i = index;">
                        <column-row-input #rowInput
                            [isColumn]="false"
                            [index]="i">
                        </column-row-input>
                    </div>
                </div>
                <div class="flexChild">
                    <matrix
                        [rowDatas]="rowDatas"
                        [isEditable]="true">
                    </matrix>
                </div>
            </div>
        </div>

        <button (click)="btnSolveClicked()">CALC</button>

        <div *ngFor="let resultMatrix of resultMatrices.resultMatrices | slice: 1, let i = index">
            Iteration: {{i+1}}
            <matrix
                [rowDatas]="resultMatrix"
                [isEditable]="true"
                [isResult]="true">
            </matrix>
        </div>
  `
})
export class AppComponent implements OnInit{

    matrixX: number;
    matrixY: number;
    rowDatas: RowData[] = [];
    displayRows: RowData[] = [];

    resultMatrices: ResultMatrices = new ResultMatrices();

    @ViewChildren('columnInput') columnInputs: QueryList<CollumnRowInputComponent>;
    @ViewChildren('rowInput') rowInputs: QueryList<CollumnRowInputComponent>;

    ngOnInit()
    {
    }

    btnCreateClicked(dimensions: number[])
    {
        this.matrixX = dimensions[0];
        this.matrixY = dimensions[1];
        this.rowDatas = Array.apply(null, Array(dimensions[0])).map(
            (value, i1) => Array[i1] = new RowData(Array.apply(null, Array(dimensions[1])).map((value, i2) => Array[i2] = new CellData()))
        );

        console.log(this.rowDatas);
    }


    btnSolveClicked()
    {
        const rowInputsArray = this.rowInputs.toArray();
        const columnInputsArray = this.columnInputs.toArray();

        const rowNumbers = [];
        rowInputsArray.forEach(rowInput => rowNumbers.push(rowInput.numbers));

        const columnNumbers = [];
        columnInputsArray.forEach(columnInput => columnNumbers.push(columnInput.numbers));

        const solver = new Solver();
        this.resultMatrices = solver.solve(rowNumbers, columnNumbers);
    }

    async delay(ms: number)
    {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}
