import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminparametresComponent } from './adminparametres.component';

describe('AdminparametresComponent', () => {
  let component: AdminparametresComponent;
  let fixture: ComponentFixture<AdminparametresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminparametresComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminparametresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
