import { LayoutStatus } from '@core/enums/layout.enum';
import { ILayout } from '../interfaces/layout.interface';
import { Overlay } from '@core/models/overlay.model';

export class LayoutModel implements ILayout {
  #id: string;
  #name: string;
  #overlays: string | Overlay;
  #status: LayoutStatus;
  #preview: string;
  #source: string;

  constructor(data?: ILayout, availableOverlays?: Overlay[]) {
    this.#id = data?.id || '';
    this.#name = data?.name || '';

    // Procesar overlay
    if (typeof data?.overlays === 'string' && availableOverlays?.length) {
      this.#overlays = availableOverlays.find(overlay => overlay.id === data.overlays) || data.overlays;
    } else {
      this.#overlays = data?.overlays || '';
    }

    this.#status = data?.status as LayoutStatus ?? LayoutStatus.BORRADOR;
    this.#preview = data?.preview || '';
    this.#source = data?.source || '';
  }

  public get id(): string {
    return this.#id;
  }

  public set id(value: string) {
    this.#id = value;
  }

  public get name(): string {
    return this.#name;
  }

  public set name(value: string) {
    this.#name = value;
  }

  public get overlays(): string | Overlay {
    return this.#overlays;
  }

  public set overlays(value: string | Overlay) {
    this.#overlays = value;
  }

  public get status(): LayoutStatus {
    return this.#status;
  }

  public set status(value: LayoutStatus) {
    this.#status = value;
  }

  public get preview(): string {
    return this.#preview;
  }

  public set preview(value: string) {
    this.#preview = value;
  }

  public get source(): string {
    return this.#source;
  }

  public set source(value: string) {
    this.#source = value;
  }
}
