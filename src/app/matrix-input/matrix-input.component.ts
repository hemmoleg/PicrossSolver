import { Component, OnInit, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'matrixinput',
  styleUrls: ['./matrix-input.component.scss'],
  template: `
    <div id="main">
        Matrix:
        <input value={{matrixX}}
            (keyup)="onKeyUp($event, true)">
        x
        <input value={{matrixY}}
            (keyup)="onKeyUp($event, false)">

        <button (click)="onBtnCreateClicked()">Create</button>
    </div>
  `,
})
export class MatrixInputComponent{

    matrixX: number;
    matrixY: number;

    @Output() btnCreateClicked = new EventEmitter<number[]>();

    constructor() {
        this.matrixX = 5;
        this.matrixY = 5;
    }

    onKeyUp(event: any, isX: boolean)
    {
        if(isX)
        {
            this.matrixX = parseInt(event.target.value);
            if(isNaN(this.matrixX))
                this.matrixX = 0;
        }
        else
        {
            this.matrixY = parseInt(event.target.value);
            if(isNaN(this.matrixY))
                this.matrixY = 0;
        }
    }

    onBtnCreateClicked()
    {
        this.btnCreateClicked.emit([this.matrixX, this.matrixY]);
    }
}
