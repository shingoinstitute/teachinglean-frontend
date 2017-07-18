// global.ts
import { environment } from '../environments/environment';

export const Globals = Object.freeze({
  baseApiUrl: environment.production ? 'https://api.teachinglean.org' : 'http://api.teachinglean.org:8080'
});
