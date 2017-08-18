import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/scan';

export interface Measurement {
  value: number;
  time: number;
}

export interface AppState {
  reference: number;
  hasReference: boolean;
  history: Measurement[];
}

function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

@Injectable()
export class AppStateService {
  private measurements$ = new Subject();

  public state$: Observable<AppState>;

  constructor() {
    let initialHistory = [];

    try {
      const fromStorage = JSON.parse(
        localStorage.getItem('protractor-history')
      );
      if (Array.isArray(fromStorage)) {
        initialHistory = fromStorage;
      }
    } catch (e) {}

    this.state$ = this.measurements$
      .startWith({
        reference: undefined,
        hasReference: false,
        history: initialHistory
      })
      .scan((prev: AppState, measurement: number) => {
        let history = prev.history;

        if (prev.hasReference) {
          const value = measurement - prev.reference;

          // Normalize value to +/- 180 degrees
          const normalizedValue = value - 360 * Math.floor((value + 180) / 360);

          // Add new measurement
          history = [
            {
              value: normalizedValue,
              time: Date.now()
            },
            ...prev.history
          ];

          // Store the 10 latest measurements for later lookup
          try {
            localStorage.setItem(
              'protractor-history',
              JSON.stringify(history.slice(0, 10))
            );
          } catch (e) {}
        }

        return {
          reference: measurement,
          hasReference: true,
          history
        };
      });
  }

  setMeasurement(value: number) {
    if (!isNumeric(value)) {
      return;
    }

    this.measurements$.next(value);
  }
}
