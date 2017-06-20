// global.ts
import { environment } from '../environments/environment';

export const Globals = Object.freeze({
  baseApiUrl: environment.production ? 'https://dev.teachinglean.org/backend/' : 'http://localhost:3000/backend'
});
