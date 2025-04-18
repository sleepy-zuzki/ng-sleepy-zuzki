import { Creator } from '@core/models/creator.model';
import { LayoutModel } from '@core/models/layout.model';
import { OverlayStatus } from '@core/enums/overlays.enum';

export interface Overlay {
  id: string;
  name: string;
  status: OverlayStatus;
  preview: string;
  owner: string | Creator;
  creator: string | Creator;
  technologies: string;
  layouts: string | LayoutModel[];
}
