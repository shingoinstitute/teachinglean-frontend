// global.ts
import { environment } from '../environments/environment';

export const Globals = Object.freeze({
  baseApiUrl: environment.production ? 'http://teachinglean.org/backend/' : 'http://localhost:8080/backend'
});
