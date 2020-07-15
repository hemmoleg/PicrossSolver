import { Component, OnInit, Input } from '@angular/core';
import { CellData } from 'src/cellData';

@Component({
    selector: 'matrix',
    styleUrls: ['./matrix.component.scss'],
    template: `
        <div id="matrixContainer">
            <row #row *ngFor="let rowData of rowDatas"
                [rowData]="rowData"
                [editable]="true">
            </row>
        </div>
    `
})
export class MatrixComponent{

    @Input() rowDatas: CellData[][];

    constructor() { }

}
