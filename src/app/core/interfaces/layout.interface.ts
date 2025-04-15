export interface ILayout {
  id: string;
  name: string;
  overlays: string; // Corresponds to overlay ID as per data-context.mdc and layouts.json
  status: string; // e.g., "Borrador", "Activo"
  preview: string; // URL to preview image
  source: string; // URL to source file/definition
} 