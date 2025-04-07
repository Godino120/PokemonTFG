import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideDatabase, getDatabase } from '@angular/fire/database';
import { environment } from './environments/environment';
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes), // Configuración de rutas
    provideHttpClient(), // Cliente HTTP para llamadas a la API
    provideFirebaseApp(() => initializeApp(environment.firebase)), // Inicializar Firebase
    provideDatabase(() => getDatabase()), // Firebase Realtime Database
  ],
}).catch(err => console.error('Error al iniciar la app:', err));
