import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { MdListModule, MdCardModule, MdButtonModule } from '@angular/material';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { ProtractorCakeComponent } from './components/protractor-cake.component';
import { HistoryComponent } from './components/history.component';

import { DeviceOrientationService } from './device-orientation.service';
import { AppStateService } from './app-state.service';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    MdButtonModule,
    MdCardModule,
    MdListModule,
    NoopAnimationsModule
  ],
  declarations: [AppComponent, HistoryComponent, ProtractorCakeComponent],
  providers: [DeviceOrientationService, AppStateService],
  bootstrap: [AppComponent]
})
export class AppModule {}
