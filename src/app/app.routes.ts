import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { ClientFormComponent } from './clients/client-form/client-form.component';
import { ClientsComponent } from './clients/clients.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { UserFormComponent } from './users/user-form/user-form.component';
import { UsersComponent } from './users/users.component';
import { VersionFormComponent } from './versions/version-form/version-form.component';
import { VersionsComponent } from './versions/versions.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: MainLayoutComponent,
    // canActivate: [authGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'users', component: UsersComponent },
      { path: 'users/new', component: UserFormComponent },
      { path: 'users/edit/:id', component: UserFormComponent },
      { path: 'versions', component: VersionsComponent },
      { path: 'versions/new', component: VersionFormComponent },
      { path: 'versions/edit/:id', component: VersionFormComponent },
      { path: 'clients', component: ClientsComponent },
      { path: 'clients/new', component: ClientFormComponent },
      { path: 'clients/edit/:id', component: ClientFormComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },
  { path: '**', redirectTo: '/login' }
];
