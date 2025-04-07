import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http'

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes), provideClientHydration(withEventReplay()), provideFirebaseApp(() => initializeApp({ projectId: "pokemon-d1bef", appId: "1:376581690978:web:c7bc7f8692565da871233b", storageBucket: "pokemon-d1bef.firebasestorage.app", apiKey: "AIzaSyCusz6sX2PMwz8reqkUxd_L0zi9UoySR_8", authDomain: "pokemon-d1bef.firebaseapp.com", messagingSenderId: "376581690978" })), provideAuth(() => getAuth()), provideHttpClient(withFetch())]
};
