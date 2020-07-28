import { Component, OnInit, ViewChildren, QueryList, ViewChild } from '@angular/core';
import { CellData, CellStatus } from '../cellData';
import { RowData } from '../rowData';
import { Solver } from '../solver';
import { ResultMatrices } from '../resultMatrices';

import { CollumnRowInputComponent } from './collumn-row-input/collumn-row-input.component';
import { MatrixComponent } from './matrix/matrix.component';

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
                        *ngFor="let item of rowDatas[0].cellDatas; let i = index;"
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
                        [displayRowDatas]="rowDatas"
                        [isEditable]="true">
                    </matrix>
                </div>
            </div>
        </div>

        <cell [cellData]="TESTcellData">
        </cell>
        <button (click)="testCell()" style="margin-top:40px">test</button><br>

        <button (click)="btnSolveClicked()">CALC</button>

        <matrix #matrixComponent
            [isEditable]="false"
            [isResult]="true"
            (matrixSet)="onMatrixSet()">
        </matrix>

        <!-- <div *ngFor="let resultMatrix of resultMatrices.resultMatrices | slice: 1, let i = index">
            Iteration: {{i+1}}
            <matrix
                [rowDatas]="resultMatrix"
                [isEditable]="true"
                [isResult]="true">
            </matrix>
        </div> -->
  `
})
export class AppComponent implements OnInit{

    matrixX: number;
    matrixY: number;
    rowDatas: RowData[] = [];
    displayRows: RowData[] = [];

    TESTcellData: CellData = new CellData();
    resultMatrices: ResultMatrices;
    resultRowDatas: RowData[] = [];
    currentResultMatrixIndex = 0;

    @ViewChildren('columnInput') columnInputs: QueryList<CollumnRowInputComponent>;
    @ViewChildren('rowInput') rowInputs: QueryList<CollumnRowInputComponent>;
    @ViewChild('matrixComponent') matrixComponent: MatrixComponent;

    testCell()
    {
        if(this.TESTcellData.status == CellStatus.empty)
            this.TESTcellData.status = CellStatus.cross;
        else
            this.TESTcellData.status = CellStatus.empty;
    }

    ngOnInit()
    {
        this.TESTcellData.status = CellStatus.empty;
        this.resultRowDatas = Array.apply(null, Array(5)).map(
            (value, i1) => Array[i1] = new RowData(Array.apply(null, Array(5)).map((value, i2) => Array[i2] = new CellData()))
        );
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


    async btnSolveClicked()
    {
        const rowInputsArray = this.rowInputs.toArray();
        const columnInputsArray = this.columnInputs.toArray();

        const rowNumbers = Array.from(rowInputsArray, rowInput => rowInput.numbers);
        const columnNumbers = Array.from(columnInputsArray, columnInput => columnInput.numbers);

        const solver = new Solver();
        this.resultMatrices = solver.solve(rowNumbers, columnNumbers);

        this.currentResultMatrixIndex = 0;
        this.setNextResultMatrix();
    }

    async setNextResultMatrix(withDelay: boolean = false)
    {
        if(!this.resultMatrices || this.currentResultMatrixIndex >= this.resultMatrices.length)
            return;

        if(withDelay)
        {
            console.log('delay...');
            await this.delay(2000);
        }

        console.log('setting matrix', this.currentResultMatrixIndex);
        this.resultRowDatas = this.resultMatrices.resultMatrices[this.currentResultMatrixIndex];
        this.matrixComponent.setRowDatasAnimted(this.resultRowDatas, this.currentResultMatrixIndex % 2 == 0);
        this.currentResultMatrixIndex++;
    }

    onMatrixSet()
    {
        this.setNextResultMatrix(true);
    }

    async delay(ms: number)
    {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}
