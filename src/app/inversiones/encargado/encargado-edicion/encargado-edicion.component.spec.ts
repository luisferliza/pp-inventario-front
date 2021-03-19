import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EncargadoEdicionComponent } from './encargado-edicion.component';

describe('EncargadoEdicionComponent', () => {
  let component: EncargadoEdicionComponent;
  let fixture: ComponentFixture<EncargadoEdicionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EncargadoEdicionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EncargadoEdicionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
