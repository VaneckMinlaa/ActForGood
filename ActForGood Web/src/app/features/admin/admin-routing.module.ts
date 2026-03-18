import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminLayoutComponent } from './components/layout/admin-layout.component';
import { AdmindashboardComponent } from './components/dashboard/admindashboard.component';
import { AdmingestdonneursComponent } from './components/manage-donors/admingestdonneurs.component';
import { AdmingestinstitutionsComponent } from './components/manage-institutions/admingestinstitutions.component';
import { AdmingestfondsetdonsComponent } from './components/manage-funds/admingestfondsetdons.component';
import { AdmingestongComponent } from './components/manage-ngos/admingestong.component';
import { AdmingestorphelinatsComponent } from './components/manage-orphanages/admingestorphelinats.component';
import { AdminparametresComponent } from './components/settings/adminparametres.component';
import { AdminrapportComponent } from './components/reports/adminrapport.component';

const routes: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    children: [
      { path: '',             component: AdmindashboardComponent },
      { path: 'donors',       component: AdmingestdonneursComponent },
      { path: 'institutions', component: AdmingestinstitutionsComponent },
      { path: 'funds',          component: AdmingestfondsetdonsComponent },
      { path: 'transactions',   component: AdmingestfondsetdonsComponent },
      { path: 'ngos',           component: AdmingestongComponent },
      { path: 'projects',       component: AdmingestongComponent },
      { path: 'orphanages',     component: AdmingestorphelinatsComponent },
      { path: 'notifications',  component: AdminrapportComponent },
      { path: 'settings',       component: AdminparametresComponent },
      { path: 'reports',        component: AdminrapportComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
