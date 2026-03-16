import {
  ApplicationConfig,
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import 'zone.js';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { errorInterceptor } from './core/interceptors/error-interceptor';
import { loadingInterceptor } from './core/interceptors/loading-interceptor';
import { InitService } from './core/services/init.service';
import { lastValueFrom, Observable } from 'rxjs';
import { Cart } from './shared/models/cart';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideZoneChangeDetection(),
    provideHttpClient(withInterceptors([errorInterceptor, loadingInterceptor])),
    provideAppInitializer(() => {
      const initService = inject(InitService);

      return lastValueFrom(initService.init()).finally(() => {
        document.getElementById('initial-splash')?.remove();
      });
    }),
  ],
};
function ilastValueFrom(arg0: Observable<Cart> | Observable<null>) {
  throw new Error('Function not implemented.');
}
