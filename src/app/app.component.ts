import { Component, OnInit, ViewChildren, QueryList, ViewChild } from '@angular/core';
import { CellData, CellStatus } from '../cellData';
import { RowData } from '../rowData';
import { Solver } from '../solver';
import { ResultMatrices } from '../resultMatrices';

import { CollumnRowInputComponent } from './collumn-row-input/collumn-row-input.component';
import { MatrixComponent } from './matrix/matrix.component';

import riddlesJSON from '../assets/riddles.json';
import { GameComponent } from './game/game.component';

@Component({
  selector: 'app-root',
  styleUrls: ['./app.component.scss', './cell/cell.component.scss'],
  template: `
        <div id="master">
            <game *ngFor="let riddle of riddlesJSON.riddles, let i = index"
                [rowInputs]="riddle.rowInputs"
                [columnInputs]="riddle.columnInputs"
                [index]="i"
                [centerIndex]="centerRiddleIndex"
                (matrixSet)="onMatrixSet()"
                ></game>
        </div>

        <cell id="testPos" [cellData]="TESTcellData">
        </cell>
        <button (click)="testCell()" style="margin-top:40px">test</button><br>

        <button (click)="btnSolveClicked()">CALC</button><br>
        <button (click)="btnMovePlusClicked()">move+</button><br>
        <button (click)="btnMoveMinusClicked()">move-</button>

        <!-- 'result animation' is played in this matrix -->
        <matrix #matrixComponent
            [isEditable]="false"
            [isResult]="true"
            (matrixSet)="onMatrixSet()">
        </matrix>

        <!-- would show each resultMatrix -> each step of the solution -->
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
    currentResultMatrixIndex = 0;

    centerRiddleIndex = 3;
    solvedGameComponent: GameComponent;

    riddlesJSON;

    @ViewChild('matrixComponent') matrixComponent: MatrixComponent;
    @ViewChildren(GameComponent) gameComponents: QueryList<GameComponent>;

    btnMovePlusClicked()
    {
        this.centerRiddleIndex++;
        if(this.centerRiddleIndex > (this.riddlesJSON.riddles.length - 1))
            this.centerRiddleIndex = this.riddlesJSON.riddles.length - 1;
    }

    btnMoveMinusClicked()
    {
        console.log(this.gameComponents);
        this.centerRiddleIndex--;
        if(this.centerRiddleIndex < 0) this.centerRiddleIndex = 0;
    }

    ngOnInit()
    {
        this.TESTcellData.status = CellStatus.empty;

        console.log(riddlesJSON);

        this.riddlesJSON = riddlesJSON;
        console.log(this.riddlesJSON);
    }

    async btnSolveClicked()
    {
        const rowNumbers = this.riddlesJSON.riddles[this.centerRiddleIndex].rowInputs;
        const columnNumbers = this.riddlesJSON.riddles[this.centerRiddleIndex].columnInputs;

        console.log(rowNumbers, columnNumbers);

        this.solvedGameComponent = this.gameComponents.toArray()[this.centerRiddleIndex];

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
        const resultRowDatas = this.resultMatrices.resultMatrices[this.currentResultMatrixIndex];
        this.solvedGameComponent.setRowDatasAnimted(resultRowDatas, this.currentResultMatrixIndex % 2 == 0);
        this.currentResultMatrixIndex++;
    }

    onMatrixSet()
    {
        //return;
        this.setNextResultMatrix(true);
    }

    testCell()
    {
        if(this.TESTcellData.status == CellStatus.empty)
            this.TESTcellData.status = CellStatus.cross;
        else
            this.TESTcellData.status = CellStatus.empty;
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


    async delay(ms: number)
    {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}
