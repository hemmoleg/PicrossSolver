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

    @Input() numbers: number[] = [1, 2];
    @Input() isColumn: boolean;

    constructor() { }
    ngOnInit(): void {
        //solved
        // if(this.isColumn)
        // {
        //     switch (this.index){
        //         case 0: this.numbers = [2]; break;
        //         case 1: this.numbers = [2,1]; break;
        //         case 2: this.numbers = [1,2]; break;
        //         case 3: this.numbers = [1,2]; break;
        //         case 4: this.numbers = [3]; break;
        //     }
        // }
        // else
        // {
        //     switch (this.index){
        //         case 0: this.numbers = [5]; break;
        //         case 1: this.numbers = [2,1]; break;
        //         case 2: this.numbers = [2]; break;
        //         case 3: this.numbers = [2]; break;
        //         case 4: this.numbers = [2]; break;
        //     }
        // }

        //solved
        // if(this.isColumn)
        // {
        //     switch (this.index){
        //         case 0: this.numbers = [1,1]; break;
        //         case 1: this.numbers = [5]; break;
        //         case 2: this.numbers = [1,1]; break;
        //         case 3: this.numbers = [5]; break;
        //         case 4: this.numbers = [1,1]; break;
        //     }
        // }
        // else
        // {
        //     switch (this.index){
        //         case 0: this.numbers = [1,1]; break;
        //         case 1: this.numbers = [5]; break;
        //         case 2: this.numbers = [1,1]; break;
        //         case 3: this.numbers = [5]; break;
        //         case 4: this.numbers = [1,1]; break;
        //     }
        // }

        //solved
        // if(this.isColumn)
        // {
        //     switch (this.index){
        //         case 0: this.numbers = [5]; break;
        //         case 1: this.numbers = [1,1]; break;
        //         case 2: this.numbers = [2,1]; break;
        //         case 3: this.numbers = [1,1]; break;
        //         case 4: this.numbers = [5]; break;
        //     }
        // }
        // else
        // {
        //     switch (this.index){
        //         case 0: this.numbers = [5]; break;
        //         case 1: this.numbers = [1,1,1]; break;
        //         case 2: this.numbers = [2,2]; break;
        //         case 3: this.numbers = [1,1]; break;
        //         case 4: this.numbers = [1,1,1]; break;
        //     }
        // }

        //solved
        // if(this.isColumn)
        // {
        //     switch (this.index){
        //         case 0: this.numbers = [3]; break;
        //         case 1: this.numbers = [1,2]; break;
        //         case 2: this.numbers = [1,1,1]; break;
        //         case 3: this.numbers = [1,1,1]; break;
        //         case 4: this.numbers = [1,1]; break;
        //     }
        // }
        // else
        // {
        //     switch (this.index){
        //         case 0: this.numbers = [4]; break;
        //         case 1: this.numbers = [1]; break;
        //         case 2: this.numbers = [1,2]; break;
        //         case 3: this.numbers = [2]; break;
        //         case 4: this.numbers = [4]; break;
        //     }
        // }

        //solved
        // if(this.isColumn)
        // {
        //     switch (this.index){
        //         case 0: this.numbers = [1]; break;
        //         case 1: this.numbers = [3]; break;
        //         case 2: this.numbers = [1,1]; break;
        //         case 3: this.numbers = [3]; break;
        //         case 4: this.numbers = [1]; break;
        //     }
        // }
        // else
        // {
        //     switch (this.index){
        //         case 0: this.numbers = [1,1]; break;
        //         case 1: this.numbers = [0]; break;
        //         case 2: this.numbers = [3]; break;
        //         case 3: this.numbers = [1,1]; break;
        //         case 4: this.numbers = [3]; break;
        //     }
        // }

        //solved
        // if(this.isColumn)
        // {
        //     switch (this.index){
        //         case 0: this.numbers = [1]; break;
        //         case 1: this.numbers = [2,1]; break;
        //         case 2: this.numbers = [3,2]; break;
        //         case 3: this.numbers = [4,2]; break;
        //         case 4: this.numbers = [5,3]; break;
        //         case 5: this.numbers = [8]; break;
        //         case 6: this.numbers = [3,4]; break;
        //         case 7: this.numbers = [2,3]; break;
        //         case 8: this.numbers = [1,2]; break;
        //         case 9: this.numbers = [1]; break;
        //     }
        // }
        // else
        // {
        //     switch (this.index){
        //         case 0: this.numbers = [5]; break;
        //         case 1: this.numbers = [5]; break;
        //         case 2: this.numbers = [5]; break;
        //         case 3: this.numbers = [5]; break;
        //         case 4: this.numbers = [10]; break;
        //         case 5: this.numbers = [4]; break;
        //         case 6: this.numbers = [4]; break;
        //         case 7: this.numbers = [4]; break;
        //         case 8: this.numbers = [3]; break;
        //         case 9: this.numbers = [2]; break;
        //     }
        // }

        // solved
        // if(this.isColumn)
        // {
        //     switch (this.index){
        //         case 0: this.numbers = [1,6,1]; break;
        //         case 1: this.numbers = [0]; break;
        //         case 2: this.numbers = [1,1]; break;
        //         case 3: this.numbers = [1,1,2]; break;
        //         case 4: this.numbers = [1,1,1,2]; break;
        //         case 5: this.numbers = [1,1,1,1,1]; break;
        //         case 6: this.numbers = [1,1,1,1,1]; break;
        //         case 7: this.numbers = [2,1]; break;
        //         case 8: this.numbers = [3,1,1,2]; break;
        //         case 9: this.numbers = [1,6,1]; break;
        //     }
        // }
        // else
        // {
        //     switch (this.index){
        //         case 0: this.numbers = [1,3]; break;
        //         case 1: this.numbers = [6]; break;
        //         case 2: this.numbers = [1,1,2]; break;
        //         case 3: this.numbers = [1,4,1]; break;
        //         case 4: this.numbers = [1,1,2]; break;
        //         case 5: this.numbers = [1,4,1]; break;
        //         case 6: this.numbers = [1,1,2]; break;
        //         case 7: this.numbers = [1,3,1]; break;
        //         case 8: this.numbers = [1,1]; break;
        //         case 9: this.numbers = [1,5]; break;
        //     }
        // }

        // solved 15x15 171
        // if(this.isColumn)
        // {
        //     switch (this.index){
        //         case 0: this.numbers = [6]; break;
        //         case 1: this.numbers = [1,1]; break;
        //         case 2: this.numbers = [1,4,1]; break;
        //         case 3: this.numbers = [3,1,1,1]; break;
        //         case 4: this.numbers = [1,11]; break;
        //         case 5: this.numbers = [1,1,1]; break;
        //         case 6: this.numbers = [1,10,1]; break;
        //         case 7: this.numbers = [1,3,4,1,1]; break;
        //         case 8: this.numbers = [1,6,3,1]; break;
        //         case 9: this.numbers = [1,10,1]; break;
        //         case 10: this.numbers = [1,1,1]; break;
        //         case 11: this.numbers = [1,10,1]; break;
        //         case 12: this.numbers = [1,1,1]; break;
        //         case 13: this.numbers = [1,10]; break;
        //         case 14: this.numbers = [2]; break;
        //     }
        // }
        // else
        // {
        //     switch (this.index){
        //         case 0: this.numbers = [3,2,2]; break;
        //         case 1: this.numbers = [1,1,1,1]; break;
        //         case 2: this.numbers = [1,1]; break;
        //         case 3: this.numbers = [9,2,1]; break;
        //         case 4: this.numbers = [1,1,6,1]; break;
        //         case 5: this.numbers = [1,3,4,1,1]; break;
        //         case 6: this.numbers = [1,1,1,1,2,1,1]; break;
        //         case 7: this.numbers = [1,1,1,4,1,1]; break;
        //         case 8: this.numbers = [1,3,4,1,1]; break;
        //         case 9: this.numbers = [1,1,2,1,1,1]; break;
        //         case 10: this.numbers = [4,4,1,1]; break;
        //         case 11: this.numbers = [1,1,2,1,1]; break;
        //         case 12: this.numbers = [1,4,1,1]; break;
        //         case 13: this.numbers = [2,2]; break;
        //         case 14: this.numbers = [6]; break;
        //     }
        // }

        // if(this.isColumn) {
        //     switch (this.index){
        //         case 0: this.numbers = [8,2,2]; break;
        //         case 1: this.numbers = [2,5,2,3]; break;
        //         case 2: this.numbers = [5,2,2,2,2]; break;
        //         case 3: this.numbers = [10,6]; break;
        //         case 4: this.numbers = [6,2,2,1]; break;
        //         case 5: this.numbers = [1,2,2,1,1]; break;
        //         case 6: this.numbers = [ 3,2,4]; break;
        //         case 7: this.numbers = [3,1,1]; break;
        //         case 8: this.numbers = [2,3,5]; break;
        //         case 9: this.numbers = [3,1,1]; break;
        //         case 10: this.numbers = [3,2]; break;
        //         case 11: this.numbers = [4,2,1]; break;
        //         case 12: this.numbers = [6,4,4]; break;
        //         case 13: this.numbers = [2,11]; break;
        //         case 14: this.numbers = [16]; break;
        //         case 15: this.numbers = [11,7]; break;
        //         case 16: this.numbers = [1,2,3,2,4]; break;
        //         case 17: this.numbers = [1,3,2,2]; break;
        //         case 18: this.numbers = [2,2,1,2,3]; break;
        //         case 19: this.numbers = [8,2,2]; break;
        //     }
        // }
        // else
        // {
        //     switch (this.index){
        //         case 0: this.numbers = [20]; break;
        //         case 1: this.numbers = [5,10,2]; break;
        //         case 2: this.numbers = [1,6,4,3,1]; break;
        //         case 3: this.numbers = [6,6,1]; break;
        //         case 4: this.numbers = [5,4,2]; break;
        //         case 5: this.numbers = [2,2,8]; break;
        //         case 6: this.numbers = [4,5,1]; break;
        //         case 7: this.numbers = [4,7]; break;
        //         case 8: this.numbers = [1,1,3]; break;
        //         case 9: this.numbers = [1,1,1,3]; break;
        //         case 10: this.numbers = [1,1,1,1,3,1]; break;
        //         case 11: this.numbers = [3,1,3,3]; break;
        //         case 12: this.numbers = [1,2,1,3,2,1]; break;
        //         case 13: this.numbers = [1,3,1,5,1]; break;
        //         case 14: this.numbers = [1,2,1,2,2,1]; break;
        //         case 15: this.numbers = [4,1,1,1,2,3]; break;
        //         case 16: this.numbers = [1,2,2,2,1,3,1]; break;
        //         case 17: this.numbers = [1,1,1,1,1,2]; break;
        //         case 18: this.numbers = [1,3,1,1,1,2]; break;
        //         case 19: this.numbers = [1,1,1,2,2]; break;
        //     }
        // }
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
