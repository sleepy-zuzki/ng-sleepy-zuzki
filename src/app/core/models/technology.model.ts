import { ITechnology } from '../interfaces/technology.interface';

export class TechnologyModel implements ITechnology {
  #id: string;
  #name: string;
  #color: string;

  constructor(data?: ITechnology) {
    this.#id = data?.id || '';
    this.#name = data?.name || '';
    this.#color = data?.color || '#FFFFFF'; // Default to white if not provided
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

  public get color(): string {
    return this.#color;
  }

  public set color(value: string) {
    this.#color = value;
  }
} 