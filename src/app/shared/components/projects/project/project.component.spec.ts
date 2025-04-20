import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProjectComponent } from './project.component';
import { Datum } from '@core/interfaces/strapi-response.interface';
import { Component, signal, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

// Mock data for Datum (simplificado)
const mockProjectData: Datum = {
  id: 'proj1',
  attributes: {
    label: 'Test Project',
    url: 'http://example.com',
    repository: 'http://github.com/example/test',
    // screenshot y techs omitidos para brevedad
    screenshot: undefined,
    techs: { data: [] }
  }
};

// Componente Host para probar InputSignal
@Component({
  standalone: true,
  imports: [ProjectComponent], // Importar ProjectComponent aquí
  template: `<app-project [project]="projectSignal()" />`,
  schemas: [CUSTOM_ELEMENTS_SCHEMA] // Para elementos hijos desconocidos (si los hubiera)
})
class TestHostComponent {
  projectSignal = signal<Datum | undefined>(undefined);
}

describe('ProjectComponent', () => {
  let hostComponent: TestHostComponent;
  let hostFixture: ComponentFixture<TestHostComponent>;
  let projectComponent: ProjectComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent], // Importar el Host
      // No necesita providers si ProjectComponent no tiene dependencias
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();

    hostFixture = TestBed.createComponent(TestHostComponent);
    hostComponent = hostFixture.componentInstance;

    // Obtener la instancia del componente ProjectComponent anidado
    projectComponent = hostFixture.debugElement.children[0].componentInstance;
  });

  it('should create', () => {
    hostFixture.detectChanges(); // Renderizar componente hijo
    expect(projectComponent).toBeTruthy();
  });

  it('should receive project input signal correctly', () => {
    // Verificar estado inicial (undefined)
    hostFixture.detectChanges();
    expect(projectComponent.project()).toBeUndefined();

    // Establecer valor en el host
    hostComponent.projectSignal.set(mockProjectData);
    hostFixture.detectChanges(); // Propagar cambio
    expect(projectComponent.project()).toEqual(mockProjectData);

    // Cambiar a undefined de nuevo
    hostComponent.projectSignal.set(undefined);
    hostFixture.detectChanges();
    expect(projectComponent.project()).toBeUndefined();
  });

  // Nota: No hay métodos públicos o lógica compleja en este componente
  // para probar más allá de la recepción del Input.
  // Las pruebas de renderizado del template (HTML) se podrían añadir aquí,
  // pero escapan al alcance de generar pruebas solo para el archivo .ts.
}); 