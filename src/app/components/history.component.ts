import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { Measurement } from '../app-state.service';

@Component({
  selector: 'protractor-history',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
      <md-list *ngIf="history.length > 0">
        <h3 md-subheader>HISTORY</h3>
        <md-card>
          <md-list-item *ngFor="let result of history">
            <protractor-cake [angle]="result.value" md-list-icon></protractor-cake>
            <h4 md-line>{{result.value.toFixed(1)}} °</h4>
            <p md-line> {{result.time | date:'mediumTime'}} </p>
          </md-list-item>
        </md-card>
      </md-list>
  `
})
export class HistoryComponent {
  @Input() history: Measurement[];
}
