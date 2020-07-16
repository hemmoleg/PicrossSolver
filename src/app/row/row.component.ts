import { Input, Component} from '@angular/core';
import { CellData, CellStatus } from '../../cellData';
import { RowData } from 'src/rowData';

@Component({
  selector: 'row',
  styleUrls: ['./row.component.scss'],
  template: `
    <div id="row"> <!--  value={{numbers[i]}} -->
        <cell *ngFor="let cellData of rowData.cellData; let i = index"
            [cellData]="cellData"
            [similiar]="similarities ? similarities.includes(i) : false"
            (click)="onCellClick(i)"
            (contextmenu)="onCellRightClick(i)">
        </cell>
    </div>
  `,
})
export class Row{

    @Input() rowData: RowData;
    @Input() editable: boolean;
    @Input() similarities: number[];

    onCellClick(clickedIndex: number)
    {
        if(!this.editable) return;
        console.log("onCellClickd", clickedIndex);
        if(this.rowData.cellData[clickedIndex].status == CellStatus.empty){
            this.rowData.cellData[clickedIndex].status = CellStatus.filled;
            this.rowData.cellData[clickedIndex].isHard = true;
        }else{
            this.rowData.cellData[clickedIndex].status = CellStatus.empty;
            this.rowData.cellData[clickedIndex].isHard = false;
        }
    }

    onCellRightClick(clickedIndex: number)
    {
        if(!this.editable) return;
        if(this.rowData.cellData[clickedIndex].status == CellStatus.empty){
            this.rowData.cellData[clickedIndex].status = CellStatus.cross;
            this.rowData.cellData[clickedIndex].isHard = true;
        }else{
            this.rowData.cellData[clickedIndex].status = CellStatus.empty;
            this.rowData.cellData[clickedIndex].isHard = false;
        }
        return false;
    }

}
