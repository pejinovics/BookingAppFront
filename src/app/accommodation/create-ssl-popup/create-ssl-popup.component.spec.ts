import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateSslPopupComponent } from './create-ssl-popup.component';

describe('CreateSslPopupComponent', () => {
  let component: CreateSslPopupComponent;
  let fixture: ComponentFixture<CreateSslPopupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateSslPopupComponent]
    });
    fixture = TestBed.createComponent(CreateSslPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
