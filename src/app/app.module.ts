import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { Cell } from './cell/cell.component';
import { Row } from './row/row.component';
import { MatrixInputComponent } from './matrix-input/matrix-input.component';

@NgModule({
   declarations: [
      AppComponent,
      Cell,
      Row,
      MatrixInputComponent,
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
