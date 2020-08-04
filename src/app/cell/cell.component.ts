import { Input, Component, Output, EventEmitter} from '@angular/core';
import {CellData, CellStatus} from '../../cellData';

@Component({
  selector: 'cell',
  styleUrls: ['./cell.component.scss'],
  template: `
    <div id="cellContainer">
        <div id="cell"
            [class.isFithColumn]="isFithColumn"
            [class.isSixthColumn]="isSixthColumn"
            [class.isFithRow]="isFithRow"
            [class.isSixthRow]="isSixthRow"
            [class.similar]="similiar"
            [class.rowFirst]="rowFirstGlow"
            [class.row]="rowGlow"
            [class.rowLast]="rowLastGlow"
            (animationend)="onAnimationEnd()">
        </div>
        <div id="fill" *ngIf="cellData.status == cellStatus.filled"
            [class.filled]="cellData.status == cellStatus.filled"
            (animationend)="onAnimationEnd()">
        </div>
        <div *ngIf="cellData.status == cellStatus.cross"
            class="crossContainer"
            (animationend)="onAnimationEnd()">
            <div class="close"></div>
        </div>
    </div>
    
  `,
})
export class Cell{

    @Input() cellData: CellData;
    @Input() isFithColumn: boolean;
    @Input() isSixthColumn: boolean;
    @Input() isFithRow: boolean;
    @Input() isSixthRow: boolean;
    @Input() similiar: boolean;

    @Input() rowFirstGlow: boolean;
    @Input() rowGlow: boolean;
    @Input() rowLastGlow: boolean;

    @Output() AnimationEnd: EventEmitter<null> = new EventEmitter();

    cellStatus = CellStatus;

    onAnimationEnd()
    {
        this.AnimationEnd.emit();
    }
}
