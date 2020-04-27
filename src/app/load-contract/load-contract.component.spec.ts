import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadContractComponent } from './load-contract.component';

describe('LoadContractComponent', () => {
  let component: LoadContractComponent;
  let fixture: ComponentFixture<LoadContractComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoadContractComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadContractComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
