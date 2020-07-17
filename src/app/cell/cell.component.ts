import { Input, Component} from '@angular/core';
import {CellData, CellStatus} from '../../cellData';

@Component({
  selector: 'cell',
  styleUrls: ['./cell.component.scss'],
  template: `
    <div id="cell"
            [class.filled]="cellData.status == cellStatus.filled"
            [class.isFithColumn]="isFithColumn"
            [class.isSixthColumn]="isSixthColumn"
            [class.isFithRow]="isFithRow"
            [class.isSixthRow]="isSixthRow"
            [class.similar]="similiar">
            <div *ngIf="cellData.status == cellStatus.cross"
                 class="wc-box">
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

  cellStatus = CellStatus;
}
