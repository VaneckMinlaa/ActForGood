import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InstitutionLayoutComponent } from './components/layout/institution-layout.component';
import { InstitutionHomeComponent } from './components/home/institution-home.component';
import { InstitutionProfileComponent } from './components/profile/institution-profile.component';
import { InstitutionProjectsComponent } from './components/projects/institution-projects.component';
import { InstitutionDonationsComponent } from './components/donations/institution-donations.component';
import { InstitutionReportsComponent } from './components/reports/institution-reports.component';
import { InstitutionConnectionsComponent } from './components/connections/institution-connections.component';
import { InstitutionActivityComponent } from './components/activity/institution-activity.component';

const routes: Routes = [
  {
    path: '',
    component: InstitutionLayoutComponent,
    children: [
      { path: '',            component: InstitutionHomeComponent },
      { path: 'profile',     component: InstitutionProfileComponent },
      { path: 'projects',    component: InstitutionProjectsComponent },
      { path: 'donations',   component: InstitutionDonationsComponent },
      { path: 'reports',     component: InstitutionReportsComponent },
      { path: 'connections', component: InstitutionConnectionsComponent },
      { path: 'activity',    component: InstitutionActivityComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)]
})
export class InstitutionModule { }
