import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { WorkDetailsFeature } from '@features/works/details/work-details.feature';

@Component({
  selector: 'app-work-details',
  standalone: true,
  imports: [
    WorkDetailsFeature
  ],
  template: `<app-work-detail-feature />`,
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class WorkDetailsPage {
}
