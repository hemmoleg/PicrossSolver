import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { Cell } from './cell/cell.component';
import { Row } from './row/row.component';
import { CollumnRowInputComponent } from './collumn-row-input/collumn-row-input.component';
import { MatrixComponent } from './matrix/matrix.component';
import { GameComponent } from './game/game.component';

@NgModule({
   declarations: [
      AppComponent,
      Cell,
      Row,
      CollumnRowInputComponent,
      MatrixComponent,
      GameComponent,
   ],
   imports: [
      BrowserModule,
      AppRoutingModule
   ],
   providers: [],
   bootstrap: [
      AppComponent
   ]
})
export class AppModule { }
