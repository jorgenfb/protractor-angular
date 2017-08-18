import { Injectable, NgZone } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { fromEvent } from 'rxjs/observable/fromEvent';
import 'rxjs/add/operator/do';

@Injectable()
export class DeviceOrientationService {
  private events = new Subject();

  constructor(private zone: NgZone) {}

  get(): Observable<DeviceOrientationEvent> {
    return fromEvent(window, 'deviceorientation').do(() => {
      this.zone.run(() => {});
    });
  }
}
