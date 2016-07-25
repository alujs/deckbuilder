// App
export * from './app.component';

import { Headers, Http } from '@angular/http';
import { CardApi } from './home/card-api.service';
import { CommService } from './comm.service';
import { UserService } from './user.service';
import { AuthGuard } from './auth.guard';
import { Router } from '@angular/router';
import { AppModel } from './classes.ts';
// Application wide providers
export const APP_PROVIDERS = [
  {
    provide: CommService,
    useFactory: () => {
      return new CommService(new AppModel())
    }
  },
  {
    provide: CardApi,
    useFactory: (CommService, Http) => {
      return new CardApi(CommService, Http);
    },
    deps: [CommService, Http]
  },
  {
    provide: UserService,
    useFactory: (CommService, Http) => {
      return new UserService(CommService, Http);
    },
    deps: [CommService, Http]
  },
  {
    provide: AuthGuard,
    useFactory: (CommService, Router) => {
      return new AuthGuard(CommService, Router);
    },
    deps: [CommService, Router]
  }
];