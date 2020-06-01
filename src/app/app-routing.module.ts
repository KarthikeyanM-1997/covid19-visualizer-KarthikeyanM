import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
import { TrackerComponent } from './tracker/tracker.component';
import { RegisterComponent } from './register/register.component';
import { LoginGuardGuard } from './login-guard.guard';


const routes: Routes = [{
  path: "", component: RegisterComponent
},
{
  path: "login", component: RegisterComponent
},
{
  path: "logout", component: LogoutComponent
},
{
  path: "tracker", component: TrackerComponent, canActivate: [LoginGuardGuard]
},
{
  path: "register", component: LoginComponent
}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
