import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {MatTableModule} from '@angular/material/table';

import { AppComponent } from './app.component';
import { SupportServiceComponent } from './support-service/support-service.component';
import { MessageTableComponent } from './message-table/message-table.component';

@NgModule({
  declarations: [
    AppComponent,
    SupportServiceComponent,
    MessageTableComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    MatTableModule,
    DragDropModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
