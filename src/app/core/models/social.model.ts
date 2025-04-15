import { Social as ISocial } from '@core/interfaces/social.interface';

export class Social {
  #id: string;
  #page: string;
  #url: string;

  constructor(data: ISocial) {
    this.#id = data.id;
    this.#page = data.page;
    this.#url = data.url;
  }

  get id(): string {
    return this.#id;
  }

  get page(): string {
    return this.#page;
  }

  get url(): string {
    return this.#url;
  }
} 