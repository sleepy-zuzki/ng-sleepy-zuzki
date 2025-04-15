import { ILayout } from '../interfaces/layout.interface';

export class LayoutModel implements ILayout {
  #id: string;
  #name: string;
  #overlays: string;
  #status: string;
  #preview: string;
  #source: string;

  constructor(data?: ILayout) {
    this.#id = data?.id || '';
    this.#name = data?.name || '';
    this.#overlays = data?.overlays || '';
    this.#status = data?.status || '';
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

  public get overlays(): string {
    return this.#overlays;
  }

  public set overlays(value: string) {
    this.#overlays = value;
  }

  public get status(): string {
    return this.#status;
  }

  public set status(value: string) {
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