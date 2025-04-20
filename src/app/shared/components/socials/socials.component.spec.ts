import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SocialsComponent } from './socials.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('SocialsComponent', () => {
  let component: SocialsComponent;
  let fixture: ComponentFixture<SocialsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SocialsComponent], // Importar componente standalone
      schemas: [CUSTOM_ELEMENTS_SCHEMA] // Para ignorar elementos wa-*
    })
    .compileComponents();

    fixture = TestBed.createComponent(SocialsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
}); 