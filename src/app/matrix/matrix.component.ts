import { Component, OnInit, Input } from '@angular/core';
import { CellData } from 'src/cellData';

@Component({
    selector: 'matrix',
    styleUrls: ['./matrix.component.scss'],
    template: `
        <div id="matrixContainer"
            [class.isResult]="isResult">
            <row #row *ngFor="let rowData of rowDatas, let i = index"
                [rowData]="rowData"
                [isEditable]="isEditable"
                [isFithRow]="(i+1) % 5 == 0 && i < rowDatas.length-1"
                [isSixthRow]="(i) % 5 == 0 && i != 0">
            </row>
        </div>
    `
})
export class MatrixComponent{

    @Input() rowDatas: CellData[][];
    @Input() isEditable: boolean;
    @Input() isResult: true;

    constructor() { }

}
