import { Input, Component, Output, EventEmitter} from '@angular/core';
import {CellData, CellStatus} from '../../cellData';

@Component({
  selector: 'cell',
  styleUrls: ['./cell.component.scss'],
  template: `
    <div id="cellContainer"
        [class.zIndex2]="zIndex2">
        <div id="cell"
            [class.isFithColumn]="isFithColumn"
            [class.isSixthColumn]="isSixthColumn"
            [class.isFithRow]="isFithRow"
            [class.isSixthRow]="isSixthRow"
            [class.similar]="similiar"
            [class.glowOn]="glowOn"
            [class.glowOff]="glowOff"
            [class.rowFirst]="rowFirst"
            [class.row]="row"
            [class.rowLast]="rowLast"
            [class.columnFirst]="columnFirst"
            [class.column]="column"
            [class.columnLast]="columnLast"
            (animationend)="onGlowAnimationEnd()">
        </div>
        <!-- [class.glow]="rowIsBeingSolved || columnFirstGlow || columnGlow || columnLastGlow" --> 
        <div id="fill" *ngIf="cellData.status == cellStatus.filled"
            [class.filled]="cellData.status == cellStatus.filled"
            (animationend)="onContentAnimationEnd()">
        </div>
        <div *ngIf="cellData.status == cellStatus.cross"
            class="crossContainer"
            (animationend)="onContentAnimationEnd()">
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

    @Input() zIndex2: boolean;
    @Input() glowOn: boolean;
    @Input() glowOff: boolean;

    @Input() rowFirst: boolean;
    @Input() row: boolean;
    @Input() rowLast: boolean;

    @Input() columnFirst: boolean;
    @Input() column: boolean;
    @Input() columnLast: boolean;

    @Input() rowIsBeingSolved: boolean;

    @Output() CellGlowAnimationEnd: EventEmitter<null> = new EventEmitter();
    @Output() CellContentAnimationEnd: EventEmitter<null> = new EventEmitter();

    cellStatus = CellStatus;

    onGlowAnimationEnd()
    {
        this.CellGlowAnimationEnd.emit();
    }

    onContentAnimationEnd()
    {
        this.CellContentAnimationEnd.emit();
    }
}
