import { Input, Component} from '@angular/core';
import {CellData, CellStatus} from '../../cellData';

@Component({
  selector: 'cell',
  styleUrls: ['./cell.component.scss'],
  template: `
    <div id="cell"
            [class.filled]="cellData.status == cellStatus.filled"
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
  @Input() similiar: boolean;

  cellStatus = CellStatus;
}
