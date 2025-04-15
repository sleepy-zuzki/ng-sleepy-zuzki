import { Creator as ICreator } from '@core/interfaces/creator.interface';
import { Social } from './social.model';
import { Social as ISocial } from '@core/interfaces/social.interface';

export class Creator {
  #id: string;
  #name: string;
  #email: string;
  #socials: Social[];

  constructor(data: ICreator, availableSocials: Social[]) {
    this.#id = data.id;
    this.#name = data.name;
    this.#email = data.email;

    // Procesar socials dentro del modelo en lugar de en el servicio
    if (typeof data.socials === 'string') {
      this.#socials = data.socials
        .split(',')
        .filter(id => id !== '')
        .map(id => availableSocials.find(social => social.id === id))
        .filter((social): social is Social => social !== undefined);
    } else {
      this.#socials = data.socials.map(social => new Social(social));
    }
  }

  get id(): string {
    return this.#id;
  }

  get name(): string {
    return this.#name;
  }

  get email(): string {
    return this.#email;
  }

  get socials(): Social[] {
    return this.#socials;
  }
} 