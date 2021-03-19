import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProyeccionEdicionComponent } from './proyeccion-edicion.component';

describe('ProyeccionEdicionComponent', () => {
  let component: ProyeccionEdicionComponent;
  let fixture: ComponentFixture<ProyeccionEdicionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProyeccionEdicionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProyeccionEdicionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
