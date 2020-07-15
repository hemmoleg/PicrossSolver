import { Input, Component} from '@angular/core';
import { CellData, CellStatus } from '../../cellData';

@Component({
  selector: 'row',
  styleUrls: ['./row.component.scss'],
  template: `
    <div id="row"> <!--  value={{numbers[i]}} -->
        <cell *ngFor="let cellData of rowData; let i = index"
            [cellData]="cellData"
            [editable]="editable"
            [similiar]="similarities ? similarities.includes(i) : false"
            (click)="onCellClick(i)"
            (contextmenu)="onCellRightClick(i)">
        </cell>
    </div>
  `,
})
export class Row{

    @Input() rowData: CellData[];
    @Input() editable: boolean;
    @Input() similarities: number[];

    onCellClick(clickedIndex: number)
    {
        console.log("onCellClickd", clickedIndex);
        if(this.rowData[clickedIndex].status == CellStatus.empty){
            this.rowData[clickedIndex].status = CellStatus.filled;
            this.rowData[clickedIndex].isHard = true;
        }else{
            this.rowData[clickedIndex].status = CellStatus.empty;
            this.rowData[clickedIndex].isHard = false;
        }
    }

    onCellRightClick(clickedIndex: number)
    {
        if(this.rowData[clickedIndex].status == CellStatus.empty){
            this.rowData[clickedIndex].status = CellStatus.cross;
            this.rowData[clickedIndex].isHard = true;
        }else{
            this.rowData[clickedIndex].status = CellStatus.empty;
            this.rowData[clickedIndex].isHard = false;
        }
        return false;
    }

}
