import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'column-row-input',
  styleUrls: ['./collumn-row-input.component.scss'],
  template: `
    <div id="columnControls"
        [class.column]="isColumn"
        [class.row]="!isColumn">
        <button (click)="onBtnMinusNumbersClicked()">-</button>
        <button (click)="onBtnPlusNumbersClicked()">+</button>
        <input *ngFor="let number of numbers; let i = index; trackBy: trackByIndex;" value={{numbers[i]}}
            (keyup)="onKeyUp($event, i)"
            (contextmenu)="onInputRightClick(i)">
    </div>
  `
})
export class CollumnRowInputComponent implements OnInit{

    numbers: number[] = [1, 2];
    @Input() isColumn: boolean;
    @Input() index: number;

    constructor() { }
    ngOnInit(): void {
        if(this.isColumn)
        {
            switch (this.index){
                case 0: this.numbers = [2]; break;
                case 1: this.numbers = [2,1]; break;
                case 2: this.numbers = [1,2]; break;
                case 3: this.numbers = [1,2]; break;
                case 4: this.numbers = [3]; break;
            }
        }
        else
        {
            switch (this.index){
                case 0: this.numbers = [5]; break;
                case 1: this.numbers = [2,1]; break;
                case 2: this.numbers = [2]; break;
                case 3: this.numbers = [2]; break;
                case 4: this.numbers = [2]; break;
            }
        }
    }

    onBtnPlusNumbersClicked()
    {
        this.numbers.push(0);
    }

    onBtnMinusNumbersClicked()
    {
        this.numbers.pop();
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
