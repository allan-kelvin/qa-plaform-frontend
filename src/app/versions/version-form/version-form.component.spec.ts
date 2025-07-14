import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VersionFormComponent } from './version-form.component';

describe('VersionFormComponent', () => {
  let component: VersionFormComponent;
  let fixture: ComponentFixture<VersionFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VersionFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VersionFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
