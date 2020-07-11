import { Input, Component} from '@angular/core';
import { CellData, CellStatus } from '../../cellData';

@Component({
  selector: 'row',
  styleUrls: ['./row.component.scss'],
  template: `
    <div id="row"> <!--  value={{numbers[i]}} -->
            <div id="rowControls">
                <div *ngIf="editable">
                    <input *ngFor="let number of numbers; let i = index; trackBy: trackByIndex;" value={{numbers[i]}}
                        (keyup)="onKeyUp($event, i)"
                        (contextmenu)="onInputRightClick(i)">
                    <button (click)="onBtnMinusNumbersClicked()">-</button>
                    <button (click)="onBtnPlusNumbersClicked()">+</button>
                </div>
            </div>
            <cell *ngFor="let cellData of rowData; let i = index"
                [cellData]="cellData"
                [editable]="editable"
                [similiar]="similarities ? similarities.includes(i) : false"
                (click)="onCellClick(i)"
                (contextmenu)="onCellRightClick(i)">
            </cell>
            <button *ngIf="editable" (click)="onBtnMinusRowClicked()">-</button>
            <button *ngIf="editable" (click)="onBtnPlusRowClicked()">+</button>
        </div>
  `,
})
export class Row{

    //numbers: number[] = [6, 1];
    numbers: number[] = [1, 2];
    @Input() rowData: CellData[];
    @Input() editable: boolean;
    @Input() similarities: number[];

    onBtnPlusNumbersClicked()
    {
        this.numbers.push(0);
    }

    onBtnMinusNumbersClicked()
    {
        this.numbers.pop();
    }

    onBtnPlusRowClicked()
    {
        this.rowData.push(new CellData());
    }

    onBtnMinusRowClicked()
    {
        this.rowData.pop();
    }

    onCellClick(clickedIndex: number)
    {
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

    onInputRightClick(clickedIndex: number)
    {
        this.numbers.splice(clickedIndex, 1);
        console.log('numbers:', this.numbers, clickedIndex);
        return false;
    }

    onKeyUp(event: any, index: number)
    {
        this.numbers[index]=parseInt(event.target.value);
        if(isNaN(this.numbers[index]))
            this.numbers[index] = 0; 
        console.log(this.numbers, event);
    }

    trackByIndex(index: number, obj: any): any {
        return index;
    }

}
