import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { RowData } from 'src/rowData';
import { CellData } from 'src/cellData';

@Component({
  selector: 'game',
  styleUrls: ['./game.component.scss'],
  template: `
    <div class="pp"  [class]="ppClass">
        <div class="parent" *ngIf="rowDatas.length > 0"
            [class]="parentClass">
            <div id="topLeftDiv" class="child">
            </div>
            <div id="topRightDiv" class="child">
                <!-- <column-row-input #columnInput
                    *ngFor="let item of rowDatas[0].cellDatas; let i = index;"
                    [isColumn]="true"
                    [index]="i">
                </column-row-input> -->
                <column-row-input #columnInput
                    *ngFor="let numbers of columnInputs; let i = index;"
                    [numbers]="numbers"
                    [isColumn]="true"
                    [index]="i">
                </column-row-input>
            </div>
            <div id="botLeftDiv" class="child">
                <!-- <div *ngFor="let item of rowDatas; let i = index;">
                    <column-row-input #rowInput
                        [isColumn]="false"
                        [index]="i">
                    </column-row-input>
                </div> -->
                <div *ngFor="let numbers of rowInputs; let i = index;">
                    <column-row-input #rowInput
                        [numbers]="numbers"
                        [isColumn]="false"
                        [index]="i">
                    </column-row-input>
                </div>
            </div>
            <div class="child">
                <matrix
                    [displayRowDatas]="rowDatas"
                    [isEditable]="true">
                </matrix>
            </div>
        </div>
    </div>
  `
 
})
export class GameComponent implements OnInit{

    ppClass: string;
    parentClass: string;

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

        switch(offset){
            case -2: this.ppClass = 'circlePos-2'; this.parentClass = 'scalePos-2'; break;
            case -1: this.ppClass = 'circlePos-1'; this.parentClass = 'scalePos-1'; break;
            case 0: this.ppClass = 'circlePos0'; this.parentClass = 'scalePos0'; break;
            case 1: this.ppClass = 'circlePos1'; this.parentClass = 'scalePos1'; break;
        }
    }

    ngOnInit()
    {
        if(!this.rowInputs)
            return;

        console.log("rowInputs", this.rowInputs);

        this.rowDatas = Array.apply(null, Array(this.rowInputs.length)).map(
            (value, i1) => Array[i1] = new RowData(Array.apply(null, Array(this.columnInputs.length)).map((value, i2) => Array[i2] = new CellData()))
        );
    }

}
