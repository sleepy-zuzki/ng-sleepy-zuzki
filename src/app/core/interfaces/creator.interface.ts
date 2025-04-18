import { Social } from './social.interface';

export interface Creator {
  id: string;
  name: string;
  email: string;
  socials: Social[] | string;
}
