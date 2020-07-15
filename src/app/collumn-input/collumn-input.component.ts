import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'column-input',
  styleUrls: ['./collumn-input.component.scss'],
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
export class CollumnInputComponent{

    numbers: number[] = [1, 2];
    @Input() matrixY: number;
    @Input() isColumn: boolean;

    constructor() { }

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
        // this.numbers.splice(clickedIndex, 1);
        // console.log('numbers:', this.numbers, clickedIndex);
        // return false;
    }

    onKeyUp(event: any, index: number)
    {
        // this.numbers[index]=parseInt(event.target.value);
        // if(isNaN(this.numbers[index]))
        //     this.numbers[index] = 0; 
        // console.log(this.numbers, event);
    }

    trackByIndex(index: number, obj: any): any {
        return index;
    }
}
