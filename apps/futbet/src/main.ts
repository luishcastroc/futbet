import { HttpClientModule } from '@angular/common/http';
import { enableProdMode, importProvidersFrom } from '@angular/core';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getDatabase, provideDatabase } from '@angular/fire/database';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { bootstrapApplication } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';

import { AppComponent } from './app/app.component';
import { routes } from './app/routes';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(
      RouterModule.forRoot(routes),
      BrowserAnimationsModule,
      HttpClientModule,
      NgxsReduxDevtoolsPluginModule.forRoot(),
      provideFirebaseApp(() => initializeApp(environment.firebase)),
      provideAuth(() => getAuth()),
      provideDatabase(() => getDatabase()),
      provideFirestore(() => getFirestore())
    ),
  ],
}).catch((err) => console.error(err));
