import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdmingestdonneursComponent } from './admingestdonneurs.component';

describe('AdmingestdonneursComponent', () => {
  let component: AdmingestdonneursComponent;
  let fixture: ComponentFixture<AdmingestdonneursComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdmingestdonneursComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdmingestdonneursComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
