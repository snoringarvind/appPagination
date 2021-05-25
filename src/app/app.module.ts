import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PaginationDirective } from './pagination.directive';
import { PaginationComponent } from './pagination/pagination.component';
import { SnoringPaginationComponent } from './snoring-pagination/snoring-pagination.component';

@NgModule({
  declarations: [
    AppComponent,
    PaginationDirective,
    PaginationComponent,
    PaginationDirective,
    SnoringPaginationComponent,
  ],
  imports: [BrowserModule, FormsModule, AppRoutingModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
