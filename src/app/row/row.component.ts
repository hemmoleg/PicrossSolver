import { Input, Component, Output, EventEmitter} from '@angular/core';
import { CellData, CellStatus } from '../../cellData';
import { RowData } from 'src/rowData';

@Component({
  selector: 'row',
  styleUrls: ['./row.component.scss'],
  template: `
    <div id="row" [class.rowIsBeingSolved]="thisRowIsBeingSolved">
        <cell *ngFor="let cellData of rowData.cellDatas; let i = index"
            [cellData]="cellData"
            [similiar]="similarities ? similarities.includes(i) : false"
            [isFithColumn]="(i+1) % 5 == 0 && i < rowData.cellDatas.length - 1"
            [isSixthColumn]="(i) % 5 == 0 && i != 0"
            [isFithRow]="isFithRow"
            [isSixthRow]="isSixthRow"
            [rowFirstGlow]="thisRowIsBeingSolved && i == 0"
            [rowGlow]="thisRowIsBeingSolved && i > 0 && i < rowData.cellDatas.length - 1"
            [rowLastGlow]="thisRowIsBeingSolved && i == rowData.cellDatas.length - 1"
            [columnFirstGlow]="columnIsBeingSolved && columnIndexToSet == i && rowIndex == 0"
            [columnGlow]="columnIsBeingSolved && columnIndexToSet == i && rowIndex > 0 && !isLast"
            [columnLastGlow]="columnIsBeingSolved && columnIndexToSet == i && isLast"
            (click)="onCellClick(i)"
            (contextmenu)="onCellRightClick(i)"
            (AnimationEnd)="onCellAnimationEnd()">
        </cell>
    </div>  <!--  [columnFirstGlow]="columnIsBeingSolved && rowIndex == 0" && columnIndex == i -->
  `,
})
export class Row{

    @Input() rowData: RowData;
    @Input() isEditable: boolean;
    @Input() isFithRow: boolean;
    @Input() isSixthRow: boolean;
    @Input() similarities: number[];
    @Input() isLast: boolean;

    @Input() thisRowIsBeingSolved: boolean;
    @Input() rowIndex: number;
    @Input() columnIsBeingSolved: boolean;
    @Input() columnIndexToSet: number;
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
        console.log(this.columnIsBeingSolved);
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
