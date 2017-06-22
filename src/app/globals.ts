// global.ts
import { environment } from '../environments/environment';

// export const Globals = { baseApiUrl: 'https://api.teachinglean.org' }

export const Globals = Object.freeze({
  baseApiUrl: environment.production ? 'https://api.teachinglean.org' : 'http://localhost:3000/backend'
});
