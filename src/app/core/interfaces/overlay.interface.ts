import { Creator } from '@core/models/creator.model';
import { LayoutModel } from '@core/models/layout.model';

export interface Overlay {
  id: string;
  name: string;
  status: string;
  preview: string;
  owner: string | Creator;
  creator: string | Creator;
  technologies: string;
  layouts: string | LayoutModel[];
} 