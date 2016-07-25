import { RouterConfig } from '@angular/router';
import { Home } from './home/home.component';
import { Splash } from './splash';
import { AuthGuard } from './auth.guard';

export const routes: RouterConfig = [
  { path: '', component: Splash },
  { path: 'home',  component: Home, canActivate:[AuthGuard] }
];

// asyncRoutes is needed for our webpack-toolkit to allow us to resolve the component correctly
export const asyncRoutes = {};
