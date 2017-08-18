import { Component, OnInit, HostListener } from '@angular/core';
import { AppStateService } from './app-state.service';
import { Subject } from 'rxjs/Subject';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/combineLatest';
import 'rxjs/add/operator/withLatestFrom';

@Component({
  selector: 'protractor-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  deviceOrientationSupported: boolean;

  private alpha$ = new Subject<number>();
  private click$ = new Subject<any>();

  public diff$;
  public history$;
  public actionText$;

  constructor(private stateService: AppStateService) {
    this.deviceOrientationSupported = 'DeviceOrientationEvent' in window;
  }

  ngOnInit() {
    // Start listen for history items
    this.history$ = this.stateService.state$.map(state => state.history);

    this.diff$ = this.stateService.state$
      .filter(state => state.hasReference)
      .map(state => state.reference)
      .combineLatest(this.alpha$, (reference, alpha) => {
        console.log('combining', alpha, reference);
        return alpha - reference;
      })
      .map(value => {
        // Normalize value to +/- 180 degrees
        return value - 360 * Math.floor((value + 180) / 360);
      });

    this.actionText$ = this.stateService.state$
      .map(state => state.hasReference)
      .map(hasRef => {
        return hasRef ? 'MEASURE' : 'TAP TO SET REFERENCE';
      });

    this.click$
      .withLatestFrom(this.alpha$, (_, alpha) => alpha)
      .subscribe(alpha => {
        this.stateService.setMeasurement(alpha);
      });
  }

  onMeasureClick() {
    this.click$.next();
  }

  @HostListener('window:deviceorientation', ['$event'])
  onOrientationChange(event: DeviceOrientationEvent) {
    console.log('Got orientation event', event);
    // If the device does not have an orientation sensor a single event is delivered
    // with alpha, beta and gamma set to null
    if (event.alpha === null && event.beta === null && event.gamma === null) {
      this.deviceOrientationSupported = false;
      return;
    }

    this.alpha$.next(event.alpha);
  }
}
