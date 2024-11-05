import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.services';
import { Curso } from '../../models/curso.model';
import { Tema } from '../../models/tema.model';
import { Docente } from '../../models/docente.model';
import { Alumno } from '../../models/alumno.model';

@Component({
  selector: 'app-add-curso',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <h2>Agregar Curso</h2>
    <div *ngIf="error" class="alert alert-danger">{{ error }}</div>

    <form (ngSubmit)="onSubmit()" *ngIf="!loading" class="curso-form">
      <div class="form-group">
        <label for="tema">Tema:</label>
        <select [(ngModel)]="curso.tema" name="tema" class="form-control" required>
          <option [ngValue]="undefined">Seleccione un tema</option>
          <option *ngFor="let tema of temas" [ngValue]="tema">{{ tema.nombre }}</option>
        </select>
      </div>

      <div class="form-group">
        <label for="fechaInicio">Fecha de Inicio:</label>
        <input [(ngModel)]="curso.fechaInicio" name="fechaInicio" type="date" class="form-control" required>
      </div>

      <div class="form-group">
        <label for="fechaFin">Fecha de Fin:</label>
        <input [(ngModel)]="curso.fechaFin" name="fechaFin" type="date" class="form-control" required>
      </div>

      <div class="form-group">
        <label for="docente">Docente:</label>
        <select [(ngModel)]="curso.docente" name="docente" class="form-control" required>
          <option [ngValue]="undefined">Seleccione un docente</option>
          <option *ngFor="let docente of docentes" [ngValue]="docente">{{ docente.nombre }}</option>
        </select>
      </div>

      <div class="form-group">
        <label for="precio">Precio:</label>
        <input [(ngModel)]="curso.precio" name="precio" type="number" step="0.01" class="form-control" required>
      </div>

      <div class="form-group">
        <label>Alumnos:</label>
        <div class="alumno-selection">
          <div class="search-box mb-2">
            <input 
              type="text" 
              [(ngModel)]="searchTerm" 
              name="searchTerm" 
              class="form-control" 
              placeholder="Buscar alumnos..."
              (input)="filterAlumnos()">
          </div>
          <div class="alumno-list">
            <div *ngFor="let alumno of filteredAlumnos" class="alumno-item">
              <label class="d-flex align-items-center">
                <input 
                  type="checkbox" 
                  [checked]="isAlumnoSelected(alumno)"
                  (change)="toggleAlumnoSelection(alumno)"
                  class="me-2">
                {{ alumno.nombre }}
              </label>
            </div>
          </div>
        </div>
      </div>

      <div class="selected-alumnos mt-3" *ngIf="curso.alumnos.length > 0">
        <h5>Alumnos Seleccionados:</h5>
        <div class="selected-list">
          <span *ngFor="let alumno of curso.alumnos" class="badge bg-primary me-2 mb-2">
            {{ alumno.nombre }}
            <button type="button" class="btn-close btn-close-white ms-2" 
                    (click)="removeAlumno(alumno)"></button>
          </span>
        </div>
      </div>

      <button type="submit" class="btn btn-primary mt-3" [disabled]="loading">
        {{ loading ? 'Guardando...' : 'Guardar Curso' }}
      </button>
    </form>
  `,
  styles: [`
    .curso-form {
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
    }
    .form-group {
      margin-bottom: 1rem;
    }
    .alumno-selection {
      border: 1px solid #dee2e6;
      border-radius: 4px;
      padding: 1rem;
      max-height: 300px;
      overflow-y: auto;
    }
    .alumno-item {
      padding: 0.5rem;
      border-bottom: 1px solid #f0f0f0;
    }
    .alumno-item:last-child {
      border-bottom: none;
    }
    .selected-list {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }
    .badge {
      display: inline-flex;
      align-items: center;
      padding: 0.5rem;
    }
    .btn-close {
      font-size: 0.75rem;
      padding: 0.25rem;
    }
  `]
})
export class AddcursoComponent implements OnInit {
  curso: Curso = {
    tema: {} as Tema,
    fechaInicio: '',
    fechaFin: '',
    docente: {} as Docente,
    precio: 0,
    alumnos: []
  };
  temas: Tema[] = [];
  docentes: Docente[] = [];
  allAlumnos: Alumno[] = [];
  filteredAlumnos: Alumno[] = [];
  loading = false;
  error: string | null = null;
  searchTerm: string = '';

  constructor(
    private apiService: ApiService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadInitialData();
  }

  loadInitialData() {
    this.apiService.getTemas().subscribe({
      next: (temas) => this.temas = temas,
      error: (err) => this.error = 'Error al cargar temas: ' + err
    });

    this.apiService.getDocentes().subscribe({
      next: (docentes) => this.docentes = docentes,
      error: (err) => this.error = 'Error al cargar docentes: ' + err
    });

    this.apiService.getAlumnos().subscribe({
      next: (alumnos) => {
        this.allAlumnos = alumnos;
        this.filteredAlumnos = alumnos;
      },
      error: (err) => this.error = 'Error al cargar alumnos: ' + err
    });
  }

  filterAlumnos() {
    if (!this.searchTerm.trim()) {
      this.filteredAlumnos = this.allAlumnos;
      return;
    }

    const searchTermLower = this.searchTerm.toLowerCase();
    this.filteredAlumnos = this.allAlumnos.filter(alumno => 
      alumno.nombre.toLowerCase().includes(searchTermLower)
    );
  }

  isAlumnoSelected(alumno: Alumno): boolean {
    return this.curso.alumnos.some(a => a.id === alumno.id);
  }

  toggleAlumnoSelection(alumno: Alumno) {
    const index = this.curso.alumnos.findIndex(a => a.id === alumno.id);
    if (index === -1) {
      this.curso.alumnos.push(alumno);
    } else {
      this.curso.alumnos.splice(index, 1);
    }
  }

  removeAlumno(alumno: Alumno) {
    this.curso.alumnos = this.curso.alumnos.filter(a => a.id !== alumno.id);
  }

  onSubmit() {
    this.loading = true;
    this.error = null;

    if (!this.validateForm()) {
      this.loading = false;
      return;
    }

    this.apiService.addCurso(this.curso).subscribe({
      next: () => {
        this.router.navigate(['/cursos']);
      },
      error: (err) => {
        this.error = 'Error al agregar el curso: ' + err;
        this.loading = false;
      }
    });
  }

  private validateForm(): boolean {
    if (!this.curso.tema.id) {
      this.error = 'Debe seleccionar un tema';
      return false;
    }
    if (!this.curso.docente.id) {
      this.error = 'Debe seleccionar un docente';
      return false;
    }
    if (!this.curso.fechaInicio || !this.curso.fechaFin) {
      this.error = 'Debe especificar las fechas de inicio y fin';
      return false;
    }
    if (this.curso.precio <= 0) {
      this.error = 'El precio debe ser mayor a 0';
      return false;
    }
    return true;
  }
}