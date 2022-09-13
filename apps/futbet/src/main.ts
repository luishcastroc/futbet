import { HttpClientModule } from '@angular/common/http';
import { enableProdMode, importProvidersFrom } from '@angular/core';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { FIREBASE_OPTIONS } from '@angular/fire/compat';
import { getDatabase, provideDatabase } from '@angular/fire/database';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { bootstrapApplication } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { HotToastModule } from '@ngneat/hot-toast';
import { NgxsFirestoreModule } from '@ngxs-labs/firestore-plugin';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { NgxsRouterPluginModule } from '@ngxs/router-plugin';
import { NgxsStoragePluginModule } from '@ngxs/storage-plugin';
import { NgxsModule } from '@ngxs/store';

import { AppComponent } from './app/app.component';
import { AuthState } from './app/core/auth/store/auth.state';
import { ResultsState } from './app/store/results.state';
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
      provideFirebaseApp(() => initializeApp(environment.firebase)),
      provideAuth(() => getAuth()),
      provideDatabase(() => getDatabase()),
      provideFirestore(() => getFirestore()),
      NgxsModule.forRoot([AuthState, ResultsState]),
      NgxsReduxDevtoolsPluginModule.forRoot(),
      NgxsRouterPluginModule.forRoot(),
      NgxsFirestoreModule.forRoot(),
      NgxsStoragePluginModule.forRoot({ key: [AuthState, ResultsState] }),
      HotToastModule.forRoot({
        position: 'bottom-center',
      })
    ),
    { provide: FIREBASE_OPTIONS, useValue: environment.firebase },
  ],
}).catch(err => console.error(err));
