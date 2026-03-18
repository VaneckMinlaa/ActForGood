import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminLayoutComponent } from './components/layout/admin-layout.component';
import { AdmindashboardComponent } from './components/dashboard/admindashboard.component';
import { AdmingestdonneursComponent } from './components/manage-donors/admingestdonneurs.component';
import { AdmingestinstitutionsComponent } from './components/manage-institutions/admingestinstitutions.component';
import { AdmingestfondsetdonsComponent } from './components/manage-funds/admingestfondsetdons.component';
import { AdmingestongComponent } from './components/manage-ngos/admingestong.component';
import { AdmingestorphelinatsComponent } from './components/manage-orphanages/admingestorphelinats.component';
import { AdminparametresComponent } from './components/settings/adminparametres.component';
import { AdminrapportComponent } from './components/reports/adminrapport.component';

@NgModule({
  imports: [
    CommonModule,
    AdminRoutingModule,
    AdminLayoutComponent,
    AdmindashboardComponent,
    AdmingestdonneursComponent,
    AdmingestinstitutionsComponent,
    AdmingestfondsetdonsComponent,
    AdmingestongComponent,
    AdmingestorphelinatsComponent,
    AdminparametresComponent,
    AdminrapportComponent
  ]
})
export class AdminModule { }
