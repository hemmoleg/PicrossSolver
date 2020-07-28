import { Input, Component, Output, EventEmitter} from '@angular/core';
import { CellData, CellStatus } from '../../cellData';
import { RowData } from 'src/rowData';

@Component({
  selector: 'row',
  styleUrls: ['./row.component.scss'],
  template: `
    <div id="row"> <!--  value={{numbers[i]}} -->
        <cell *ngFor="let cellData of rowData.cellDatas; let i = index"
            [cellData]="cellData"
            [similiar]="similarities ? similarities.includes(i) : false"
            [isFithColumn]="(i+1) % 5 == 0 && i < rowData.cellDatas.length - 1"
            [isSixthColumn]="(i) % 5 == 0 && i != 0"
            [isFithRow]="isFithRow"
            [isSixthRow]="isSixthRow"
            (click)="onCellClick(i)"
            (contextmenu)="onCellRightClick(i)"
            (AnimationEnd)="onCellAnimationEnd()">
        </cell>
    </div>
  `,
})
export class Row{

    @Input() rowData: RowData;
    @Input() isEditable: boolean;
    @Input() isFithRow: boolean;
    @Input() isSixthRow: boolean;
    @Input() similarities: number[];
    @Output() CellAnimationEnd = new EventEmitter();

    onCellClick(clickedIndex: number)
    {
        if(!this.isEditable) return;
        console.log("onCellClickd", clickedIndex);
        if(this.rowData.cellDatas[clickedIndex].status == CellStatus.empty){
            this.rowData.cellDatas[clickedIndex].status = CellStatus.filled;
            this.rowData.cellDatas[clickedIndex].isHard = true;
        }else{
            this.rowData.cellDatas[clickedIndex].status = CellStatus.empty;
            this.rowData.cellDatas[clickedIndex].isHard = false;
        }
    }

    onCellAnimationEnd()
    {
        this.CellAnimationEnd.emit();
    }

    onCellRightClick(clickedIndex: number)
    {
        if(!this.isEditable) return;
        if(this.rowData.cellDatas[clickedIndex].status == CellStatus.empty){
            this.rowData.cellDatas[clickedIndex].status = CellStatus.cross;
            this.rowData.cellDatas[clickedIndex].isHard = true;
        }else{
            this.rowData.cellDatas[clickedIndex].status = CellStatus.empty;
            this.rowData.cellDatas[clickedIndex].isHard = false;
        }
        return false;
    }

}
