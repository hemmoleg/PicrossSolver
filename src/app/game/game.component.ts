import { Component, OnInit, Input, AfterViewInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { RowData } from 'src/rowData';
import { CellData } from 'src/cellData';
import { MatrixComponent } from '../matrix/matrix.component';

@Component({
  selector: 'game',
  styleUrls: ['./game.component.scss'],
  template: `
    <div class="mainDiv"  [class]="mainDivClass">
        <div class="subDiv" *ngIf="rowDatas.length > 0"
            [class]="subDivClass">
            <div id="topLeftDiv" class="child">
            </div>
            <div id="topRightDiv" class="child">
                <column-row-input #columnInput
                    *ngFor="let numbers of columnInputs; let i = index;"
                    [numbers]="numbers"
                    [isColumn]="true">
                </column-row-input>
            </div>
            <div id="botLeftDiv" class="child">
                <div *ngFor="let numbers of rowInputs; let i = index;">
                    <column-row-input #rowInput
                        [numbers]="numbers"
                        [isColumn]="false">
                    </column-row-input>
                </div>
            </div>
            <div class="child">
                <matrix
                    [displayRowDatas]="rowDatas"
                    [isEditable]="true"
                    (matrixSet)="onMatrixSet()">
                </matrix>
            </div>
        </div>
    </div>
  `
 
})
export class GameComponent implements OnInit{

    mainDivClass: string;
    subDivClass: string;

    @ViewChild(MatrixComponent) matrixComponent: MatrixComponent;
    @Input() rowDatas: RowData[] = [];

    @Input() rowInputs: Array<Array<number>>;
    // @Input() set RowInputs( rowInputs: Array<Array<number>>)
    // {
    //     this.rowInputs = rowInputs;
        
        
    // }
    @Input() columnInputs: Array<Array<number>>;

    @Input() index: number;
    @Input() set centerIndex(centerIndex: number)
    {
        const offset = this.index - centerIndex;

        if(offset < -2)
        {
            this.mainDivClass = 'circlePosHiddenLeft';
            this.subDivClass = 'scalePosHiddenLeft';
            return;
        }

        if(offset > 2)
        {
            this.mainDivClass = 'circlePosHiddenRight';
            this.subDivClass = 'scalePosHiddenRight';
            return;
        }

        switch(offset){
            case -2: this.mainDivClass = 'circlePos-2'; this.subDivClass = 'scalePos-2'; break;
            case -1: this.mainDivClass = 'circlePos-1'; this.subDivClass = 'scalePos-1'; break;
            case 0: this.mainDivClass = 'circlePos0'; this.subDivClass = 'scalePos0'; break;
            case 1: this.mainDivClass = 'circlePos1'; this.subDivClass = 'scalePos1'; break;
            case 2: this.mainDivClass = 'circlePos2'; this.subDivClass = 'scalePos2'; break;
        }
    }

    @Output() matrixSet = new EventEmitter();

    ngOnInit()
    {
        if(!this.rowInputs)
            return;

        this.rowDatas = Array.apply(null, Array(this.rowInputs.length)).map(
            (value, i1) => Array[i1] = new RowData(Array.apply(null, Array(this.columnInputs.length)).map((value, i2) => Array[i2] = new CellData()))
        );
    }

    setRowDatasAnimated(resultRowDatas: RowData[], setByColumn: boolean)
    {
        this.matrixComponent.setRowDatasAnimated(resultRowDatas, setByColumn);
    }

    onMatrixSet()
    {
        this.matrixSet.emit();
    }

}
