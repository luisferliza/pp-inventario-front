import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChequeEdicionComponent } from './cheque-edicion.component';

describe('ChequeEdicionComponent', () => {
  let component: ChequeEdicionComponent;
  let fixture: ComponentFixture<ChequeEdicionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChequeEdicionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChequeEdicionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
