import { Overlay } from '@core/models/overlay.model';

export interface ILayout {
  id: string;
  name: string;
  overlays: string | Overlay; // Puede ser un ID o un objeto Overlay
  status: string; // e.g., "Borrador", "Activo"
  preview: string; // URL to preview image
  source: string; // URL to source file/definition
} 