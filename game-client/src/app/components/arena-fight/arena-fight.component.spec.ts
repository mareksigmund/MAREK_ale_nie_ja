import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArenaFightComponent } from './arena-fight.component';

describe('ArenaFightComponent', () => {
  let component: ArenaFightComponent;
  let fixture: ComponentFixture<ArenaFightComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ArenaFightComponent]
    });
    fixture = TestBed.createComponent(ArenaFightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
