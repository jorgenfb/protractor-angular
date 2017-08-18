import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  ChangeDetectionStrategy
} from '@angular/core';

function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

@Component({
  selector: 'protractor-cake',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
      <svg class="indicator" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
      <circle cx="60" cy="60" r="55" stroke-width="2" stroke="#ddd" fill="#eee" />
      <path [attr.d]="path" stroke="#000" fill="#ff4081" stroke-width="2" stroke-linecap="round" />
      <!--<rect x="40" y="70" width="40" height="20" rx="2" ry="2" fill="#888"/>-->
      <text *ngIf="viewValue.length > 0"
        x="60"
        y="80"
        stroke="#eee"
        fill="#000"
        stroke-width="1"
        text-anchor="middle"
        font-family="Verdana"
        font-size="12"
        style="paint-order: stroke;">
          {{viewValue}}°
      </text>
    </svg>
  `
})
export class ProtractorCakeComponent implements OnChanges {
  @Input() angle: number;

  path = '';
  viewValue = '';

  static get RADIUS() {
    return 55;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['angle'] && isNumeric(this.angle)) {
      this.path = this.computePath(this.angle).trim();
      this.viewValue = this.angle.toFixed(0);
    }
  }

  private computePath(angleInDegrees) {
    const angle = angleInDegrees * Math.PI / 180;

    const dx = ProtractorCakeComponent.RADIUS * Math.sin(angle);
    const dy =
      ProtractorCakeComponent.RADIUS -
      ProtractorCakeComponent.RADIUS * Math.cos(angle);

    const sweepFlag = angle > 0 ? 1 : 0;
    const largeArc = Math.abs(angle) > Math.PI ? 1 : 0;

    return `
          M60 60
          L 60 5
          a 55 55 0 ${largeArc} ${sweepFlag} ${dx} ${dy}
          L 60 60
      `;
  }
}
