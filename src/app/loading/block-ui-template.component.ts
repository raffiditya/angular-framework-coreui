import { Component, ViewEncapsulation } from "@angular/core";

@Component({
  template: `
    <div class="block-ui-template">
      <div class="spin-wrapper">
        <div class="spinner">
        </div>
      </div>
      <div class="message">{{message}}</div>
    </div>
  `,
  styleUrls: ['./block-ui-template.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class BlockUiTemplateComponent {
  message: any;
}
