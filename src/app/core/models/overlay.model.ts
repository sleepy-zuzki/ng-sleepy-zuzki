import { Overlay as IOverlay } from '@core/interfaces/overlay.interface';

export class Overlay implements IOverlay {
  #id: string;
  #name: string;
  #status: string;
  #preview: string;
  #owner: string;
  #creator: string;
  #technologies: string;
  #layouts: string[];

  constructor(data?: Partial<IOverlay>) {
    this.#id = data?.id ?? '';
    this.#name = data?.name ?? '';
    this.#status = data?.status ?? '';
    this.#preview = data?.preview ?? '';
    this.#owner = data?.owner ?? '';
    this.#creator = data?.creator ?? '';
    this.#technologies = data?.technologies ?? '';
    this.#layouts = data?.layouts ?? [];
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

  get status(): string {
    return this.#status;
  }

  set status(value: string) {
    this.#status = value;
  }

  get preview(): string {
    return this.#preview;
  }

  set preview(value: string) {
    this.#preview = value;
  }

  get owner(): string {
    return this.#owner;
  }

  set owner(value: string) {
    this.#owner = value;
  }

  get creator(): string {
    return this.#creator;
  }

  set creator(value: string) {
    this.#creator = value;
  }

  get technologies(): string {
    return this.#technologies;
  }

  set technologies(value: string) {
    this.#technologies = value;
  }

  get layouts(): string[] {
    return this.#layouts;
  }

  set layouts(value: string[]) {
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