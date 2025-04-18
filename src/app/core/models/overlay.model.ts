import { Overlay as IOverlay } from '@core/interfaces/overlay.interface';
import { Creator } from '@core/models/creator.model';
import { LayoutModel } from '@core/models/layout.model';
import { OverlayStatus } from '@core/enums/overlays.enum';

export class Overlay implements IOverlay {
  #id: string;
  #name: string;
  #status: OverlayStatus;
  #preview: string;
  #owner: string | Creator;
  #creator: string | Creator;
  #technologies: string;
  #layouts: string | LayoutModel[];

  constructor(data?: Partial<IOverlay>, availableCreators?: Creator[], availableLayouts?: LayoutModel[]) {
    this.#id = data?.id ?? '';
    this.#name = data?.name ?? '';
    this.#status = data?.status as OverlayStatus ?? OverlayStatus.BORRADOR;
    this.#preview = data?.preview ?? '';

    // Procesar owner
    if (typeof data?.owner === 'string' && availableCreators?.length) {
      this.#owner = availableCreators.find(creator => creator.id === data.owner) || data.owner;
    } else {
      this.#owner = data?.owner ?? '';
    }

    // Procesar creator
    if (typeof data?.creator === 'string' && availableCreators?.length) {
      this.#creator = availableCreators.find(creator => creator.id === data.creator) || data.creator;
    } else {
      this.#creator = data?.creator ?? '';
    }

    this.#technologies = data?.technologies ?? '';

    // Procesar layouts
    if (typeof data?.layouts === 'string' && availableLayouts?.length) {
      this.#layouts = data.layouts
      .split(',')
      .filter(id => id !== '')
      .map(id => availableLayouts.find(layout => layout.id === id))
      .filter((layout): layout is LayoutModel => layout !== undefined);
    } else if (Array.isArray(data?.layouts)) {
      this.#layouts = data.layouts;
    } else {
      this.#layouts = '';
    }
  }

  get id(): string {
    return this.#id;
  }

  set id(value: string) {
    this.#id = value;
  }

  get name(): string {
    return this.#name;
  }

  set name(value: string) {
    this.#name = value;
  }

  get status(): OverlayStatus {
    return this.#status;
  }

  set status(value: OverlayStatus) {
    this.#status = value;
  }

  get preview(): string {
    return this.#preview;
  }

  set preview(value: string) {
    this.#preview = value;
  }

  get owner(): string | Creator {
    return this.#owner;
  }

  set owner(value: string | Creator) {
    this.#owner = value;
  }

  get creator(): string | Creator {
    return this.#creator;
  }

  set creator(value: string | Creator) {
    this.#creator = value;
  }

  get technologies(): string {
    return this.#technologies;
  }

  set technologies(value: string) {
    this.#technologies = value;
  }

  get layouts(): string | LayoutModel[] {
    return this.#layouts;
  }

  set layouts(value: string | LayoutModel[]) {
    this.#layouts = value;
  }

  toJson(): IOverlay {
    return {
      id: this.#id,
      name: this.#name,
      status: this.#status,
      preview: this.#preview,
      owner: this.#owner,
      creator: this.#creator,
      technologies: this.#technologies,
      layouts: this.#layouts
    };
  }
}
