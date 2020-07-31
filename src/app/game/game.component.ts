import { Component, OnInit, Input } from '@angular/core';
import { RowData } from 'src/rowData';

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
                <column-row-input #columnInput
                    *ngFor="let item of rowDatas[0].cellDatas; let i = index;"
                    [isColumn]="true"
                    [index]="i">
                </column-row-input>
            </div>
            <div id="botLeftDiv" class="child">
                <div *ngFor="let item of rowDatas; let i = index;">
                    <column-row-input #rowInput
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
export class GameComponent{

    @Input() rowDatas: RowData[] = [];
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

    ppClass: string;
    parentClass: string;

}
