import { Component } from '@angular/core';
import { ControlsGridComponent } from '../../shared/components/ui/controls-grid.component';

@Component({
  selector: 'app-home-feature',
  standalone: true,
  imports: [ControlsGridComponent],
  templateUrl: './home.feature.html',
  styleUrl: './home.feature.css',
})
export class HomeFeatureComponent {} 